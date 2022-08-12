# TikTok Pixel Managed Component

Find out more about Managed Components [here](https://blog.cloudflare.com/zaraz-open-source-managed-components-and-webcm/) for inspiration and motivation details.

## 🚀 Quickstart local dev environment

1. Make sure you're running node version >=17.
2. Install dependencies with `npm i`
3. Run unit test watcher with `npm run test:dev`

## ⚙️ Tool Settings

> Settings are used to configure the tool in a Component Manager config file

### Pixel ID `string` _required_

`pixelId` is a long number that identifies your TikTok Ad account. You can obtain it from the [Events Manager](https://ads.tiktok.com/marketing_api/docs?rid=p41a33fdhon&id=1727537566862337) underneath your site name.

### Conversion API Access Token _required_

`accessToken` is a string used to authenticate when sending server side events in your name. You can obtain it [following the information here](https://ads.tiktok.com/marketing_api/docs?rid=p41a33fdhon&id=1727537566862337).

### Test Event Code

`testEventCode` is used to test your app or web browser events using test events tool [Learn more](https://ads.tiktok.com/marketing_api/docs?rid=p41a33fdhon&id=1724255493685249)

## 🧱 Fields Description

> Fields are properties that can/must be sent with certain events

### Email `string`

`em` user email

### Phone Number `string`

`ph` remove symbols, letters, and any leading zeros. Phone numbers must include a country code to be used for matching (e.g., the number 1 must precede a phone number in the United States). Always include the country code as part of your customers' phone numbers, even if all of your data is from the same country.

### First Name `string`

`fn` using Roman alphabet a-z characters is recommended. Lowercase only with no punctuation.

### Last Name `string`

`ln` using Roman alphabet a-z characters is recommended. Lowercase only with no punctuation.

### External ID `string`

`external_id` any unique ID from the advertiser, such as loyalty membership IDs, user IDs, and external cookie IDs

## 📝 License

Licensed under the [Apache License](./LICENSE).
