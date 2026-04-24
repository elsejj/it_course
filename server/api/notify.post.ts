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

  const text = `**IP**: ${ip}
**Browser**: ${uap.browser.name} ${uap.browser.type} ${uap.browser.version}
**OS**: ${uap.os.name} ${uap.os.version}
**Device**: ${uap.device.vendor} ${uap.device.model} ${uap.device.type}
**Score**: ${body.score} / ${body.total}
  `
  const title = "调用统计: LYZ"

  const data = {
    "msg_type": "post",
    "content": {
      "post": {
        "zh_cn": {
          "title": title,
          "content": [
            [{
              "tag": "text",
              "text": text
            }]
          ]
        }
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
