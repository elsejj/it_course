import { UAParser } from 'ua-parser-js'

const WEBHOOK_URL = process.env.STAT_WEBHOOK_URL || ""



export default defineEventHandler(async (event) => {

  if (!WEBHOOK_URL) {
    return {
      code: 0,
      message: "未配置webhook"
    }
  }

  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid body is required'
    })
  }

  const ip = event.headers.get("x-forwarded-for") || ""
  const ua = event.headers.get("user-agent") || ""

  const uap = UAParser(ua)

  const text = `
**来源**: ${ip}
**浏览器**: ${uap.browser.name || ''} ${uap.browser.type || ''} ${uap.browser.version || ''}
**系统**: ${uap.os.name || ''} ${uap.os.version || ''}
**设备**: ${uap.device.vendor || ''} ${uap.device.model || ''} ${uap.device.type || ''}
**得分**: ${body.score} / ${body.total}
  `
  const title = "调用统计: LYZ"

  const data = {
    "msg_type": "interactive",
    "card": {
      "schema": "2.0",
      "config": {
        "update_multi": true,
        "style": {
          "text_size": {
            "normal_v2": {
              "default": "normal",
              "pc": "normal",
              "mobile": "heading"
            }
          }
        },
      },
      "header": {
        "title": {
          "tag": "plain_text",
          "content": title
        }
      },
      "body": {
        "elements": [
          {
            "tag": "markdown",
            "content": text,
            "text_align": "left",
            "text_size": "normal_v2",
            "margin": "0px 0px 0px 0px"
          }
        ]
      }
    }
  }

  try {
    await $fetch(WEBHOOK_URL, {
      method: 'POST',
      body: data
    })
  } catch (error) {
    console.log("notify error: ", error)
  }


  return body
})
