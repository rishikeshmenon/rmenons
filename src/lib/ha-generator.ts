import JSZip from 'jszip'

interface Device {
  id: string
  name: string
  type: string
  protocol: string
  room: string
  integration: string
  config: Record<string, any>
}

interface SetupPackData {
  orderId: string
  ecosystem: 'google' | 'alexa' | 'home-assistant'
  devices: Device[]
  rooms: string[]
  userPreferences: {
    privacyLevel: 'minimal' | 'moderate' | 'high'
    hasPets: boolean
    timezone: string
  }
}

export class HomeAssistantGenerator {
  private data: SetupPackData

  constructor(data: SetupPackData) {
    this.data = data
  }

  generateConfigurationYAML(): string {
    const integrations = this.getUniqueIntegrations()
    const config = {
      default_config: {},
      homeassistant: {
        name: 'Smart Home',
        latitude: '43.6532',
        longitude: '-79.3832',
        elevation: 100,
        unit_system: 'metric',
        time_zone: this.data.userPreferences.timezone,
        country: 'CA',
        language: 'en',
        packages: '!include_dir_named packages'
      },
      frontend: {
        themes: '!include_dir_merge_named themes'
      },
      history: {},
      logbook: {},
      recorder: {
        db_url: 'sqlite:///homeassistant.db'
      },
      automation: '!include automations.yaml',
      script: '!include scripts.yaml',
      scene: '!include scenes.yaml',
      group: '!include groups.yaml',
      person: [],
      zone: [],
      mobile_app: {},
      ...this.generateIntegrationConfigs(integrations)
    }

    return this.yamlStringify(config)
  }

  generateAutomationsYAML(): string {
    const automations = []

    // Room-based lighting automations
    this.data.rooms.forEach(room => {
      const roomDevices = this.data.devices.filter(d => d.room === room)
      const lights = roomDevices.filter(d => d.type === 'light')
      const motionSensors = roomDevices.filter(d => d.type === 'motion_sensor')
      const doorSensors = roomDevices.filter(d => d.type === 'door_sensor')

      if (lights.length > 0 && motionSensors.length > 0) {
        // Motion-triggered lighting
        automations.push({
          alias: `${room} Motion Lighting`,
          description: `Turn on lights when motion detected in ${room}`,
          trigger: motionSensors.map(sensor => ({
            platform: 'state',
            entity_id: `binary_sensor.${sensor.name.toLowerCase().replace(/\s+/g, '_')}`,
            to: 'on'
          })),
          condition: [
            {
              condition: 'time',
              after: '06:00:00',
              before: '23:00:00'
            }
          ],
          action: [
            {
              service: 'light.turn_on',
              target: {
                entity_id: lights.map(light => `light.${light.name.toLowerCase().replace(/\s+/g, '_')}`)
              }
            }
          ]
        })

        // Turn off lights when no motion
        automations.push({
          alias: `${room} Motion Lighting Off`,
          description: `Turn off lights when no motion in ${room}`,
          trigger: motionSensors.map(sensor => ({
            platform: 'state',
            entity_id: `binary_sensor.${sensor.name.toLowerCase().replace(/\s+/g, '_')}`,
            to: 'off',
            for: '00:05:00'
          })),
          action: [
            {
              service: 'light.turn_off',
              target: {
                entity_id: lights.map(light => `light.${light.name.toLowerCase().replace(/\s+/g, '_')}`)
              }
            }
          ]
        })
      }

      // Door sensor automations
      if (doorSensors.length > 0) {
        automations.push({
          alias: `${room} Door Notification`,
          description: `Notify when door is opened in ${room}`,
          trigger: doorSensors.map(sensor => ({
            platform: 'state',
            entity_id: `binary_sensor.${sensor.name.toLowerCase().replace(/\s+/g, '_')}`,
            to: 'on'
          })),
          action: [
            {
              service: 'notify.persistent_notification',
              data: {
                title: `${room} Door Opened`,
                message: `Door sensor in ${room} was triggered`
              }
            }
          ]
        })
      }
    })

    // Pet-friendly adjustments
    if (this.data.userPreferences.hasPets) {
      automations.push({
        alias: 'Pet-Friendly Motion Sensitivity',
        description: 'Adjust motion sensor sensitivity during pet active hours',
        trigger: [
          {
            platform: 'time',
            at: '22:00:00'
          },
          {
            platform: 'time',
            at: '06:00:00'
          }
        ],
        action: [
          {
            service: 'input_number.set_value',
            target: {
              entity_id: 'input_number.motion_sensitivity'
            },
            data: {
              value: '{{ "0.3" if trigger.platform == "time" and trigger.at == "22:00:00" else "0.7" }}'
            }
          }
        ]
      })
    }

    // Privacy-focused automations
    if (this.data.userPreferences.privacyLevel === 'high') {
      automations.push({
        alias: 'Privacy Mode - Disable Cloud Services',
        description: 'Disable cloud-dependent services during privacy hours',
        trigger: [
          {
            platform: 'time',
            at: '23:00:00'
          },
          {
            platform: 'time',
            at: '06:00:00'
          }
        ],
        action: [
          {
            service: 'input_boolean.turn_off',
            target: {
              entity_id: 'input_boolean.cloud_services'
            }
          }
        ]
      })
    }

    return this.yamlStringify(automations)
  }

  generateLovelaceConfig(): string {
    const views = []

    // Create a view for each room
    this.data.rooms.forEach(room => {
      const roomDevices = this.data.devices.filter(d => d.room === room)
      const cards = []

      // Lights card
      const lights = roomDevices.filter(d => d.type === 'light')
      if (lights.length > 0) {
        cards.push({
          type: 'entities',
          title: 'Lights',
          entities: lights.map(light => `light.${light.name.toLowerCase().replace(/\s+/g, '_')}`)
        })
      }

      // Sensors card
      const sensors = roomDevices.filter(d => ['motion_sensor', 'door_sensor', 'temperature_sensor'].includes(d.type))
      if (sensors.length > 0) {
        cards.push({
          type: 'entities',
          title: 'Sensors',
          entities: sensors.map(sensor => `binary_sensor.${sensor.name.toLowerCase().replace(/\s+/g, '_')}`)
        })
      }

      // Climate card
      const climate = roomDevices.filter(d => d.type === 'thermostat')
      if (climate.length > 0) {
        cards.push({
          type: 'thermostat',
          entity: `climate.${climate[0].name.toLowerCase().replace(/\s+/g, '_')}`
        })
      }

      if (cards.length > 0) {
        views.push({
          title: room,
          path: room.toLowerCase().replace(/\s+/g, '_'),
          cards: cards
        })
      }
    })

    // Overview view
    views.unshift({
      title: 'Overview',
      path: 'overview',
      cards: [
        {
          type: 'entities',
          title: 'Quick Controls',
          entities: this.data.devices
            .filter(d => ['light', 'switch'].includes(d.type))
            .slice(0, 6)
            .map(device => `${d.type}.${device.name.toLowerCase().replace(/\s+/g, '_')}`)
        },
        {
          type: 'weather-forecast',
          entity: 'weather.home'
        },
        {
          type: 'sensor',
          entity: 'sensor.time'
        }
      ]
    })

    return this.yamlStringify({
      title: 'Smart Home Dashboard',
      views: views
    })
  }

  generateReadme(): string {
    return `# Smart Home Setup Pack

## Overview
This setup pack contains all the necessary configuration files for your Home Assistant installation.

## What's Included
- \`configuration.yaml\` - Main Home Assistant configuration
- \`automations.yaml\` - Pre-configured automations for your devices
- \`ui-lovelace.yaml\` - Dashboard configuration
- \`README.md\` - This file with setup instructions

## Devices in Your Setup
${this.data.devices.map(device => `- ${device.name} (${device.type}) - ${device.room}`).join('\n')}

## Setup Instructions

### 1. Install Home Assistant
Follow the official installation guide: https://www.home-assistant.io/installation/

### 2. Copy Configuration Files
1. Stop Home Assistant
2. Copy the configuration files to your Home Assistant config directory
3. Restart Home Assistant

### 3. Configure Integrations
The following integrations need to be configured in Home Assistant:
${this.getUniqueIntegrations().map(integration => `- ${integration}`).join('\n')}

### 4. Device Pairing
${this.generateDevicePairingInstructions()}

### 5. Customization
- Modify \`automations.yaml\` to adjust automation behavior
- Edit \`ui-lovelace.yaml\` to customize your dashboard
- Add more devices by updating \`configuration.yaml\`

## Support
For questions or support, contact us at support@smarthomesolutions.ca

## Troubleshooting
- Check the Home Assistant logs for any configuration errors
- Ensure all devices are properly paired before testing automations
- Verify network connectivity for all devices

Generated on: ${new Date().toISOString()}
Order ID: ${this.data.orderId}
`
  }

  private getUniqueIntegrations(): string[] {
    const integrations = new Set<string>()
    this.data.devices.forEach(device => {
      if (device.integration) {
        integrations.add(device.integration)
      }
    })
    return Array.from(integrations)
  }

  private generateIntegrationConfigs(integrations: string[]): Record<string, any> {
    const configs: Record<string, any> = {}

    integrations.forEach(integration => {
      switch (integration) {
        case 'zigbee':
          configs.zigbee = {
            zigpy_config: {
              network: {
                pan_id: 0x1234,
                extended_pan_id: '0x1234567890abcdef',
                channel: 11
              }
            }
          }
          break
        case 'zwave':
          configs.zwave_js = {
            url: 'ws://localhost:3000'
          }
          break
        case 'wifi':
          // WiFi devices typically don't need special config
          break
        default:
          // Add other integration configs as needed
          break
      }
    })

    return configs
  }

  private generateDevicePairingInstructions(): string {
    const instructions: string[] = []

    this.data.devices.forEach(device => {
      switch (device.protocol) {
        case 'zigbee':
          instructions.push(`- ${device.name}: Put in pairing mode and use the Zigbee integration to add it`)
          break
        case 'zwave':
          instructions.push(`- ${device.name}: Put in pairing mode and use the Z-Wave integration to add it`)
          break
        case 'wifi':
          instructions.push(`- ${device.name}: Connect to your WiFi network and add via the device's app`)
          break
        default:
          instructions.push(`- ${device.name}: Follow the manufacturer's pairing instructions`)
      }
    })

    return instructions.join('\n')
  }

  private yamlStringify(obj: any): string {
    // Simple YAML stringifier - in production, use a proper YAML library
    return JSON.stringify(obj, null, 2)
      .replace(/"/g, '')
      .replace(/,/g, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .replace(/\{/g, '')
      .replace(/\}/g, '')
  }

  async generateSetupPack(): Promise<Blob> {
    const zip = new JSZip()

    // Add configuration files
    zip.file('configuration.yaml', this.generateConfigurationYAML())
    zip.file('automations.yaml', this.generateAutomationsYAML())
    zip.file('ui-lovelace.yaml', this.generateLovelaceConfig())
    zip.file('README.md', this.generateReadme())

    // Add device-specific configuration files
    this.data.devices.forEach(device => {
      if (device.config) {
        zip.file(`devices/${device.name.toLowerCase().replace(/\s+/g, '_')}.yaml`, 
          this.yamlStringify(device.config))
      }
    })

    return await zip.generateAsync({ type: 'blob' })
  }
}

export async function generateSetupPack(data: SetupPackData): Promise<Blob> {
  const generator = new HomeAssistantGenerator(data)
  return await generator.generateSetupPack()
}
