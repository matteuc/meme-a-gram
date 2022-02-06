import fs from 'fs'
import axios from 'axios'
import { CONFIG } from './constants'

axios
  .get(
    `https://cognito-idp.${CONFIG.aws_cognito_pool_region}.amazonaws.com/${CONFIG.aws_cognito_pool_id}/.well-known/jwks.json`,
  )
  .then(async (res) => {
    const jwk = res.data

    fs.writeFileSync('./jwk.json', JSON.stringify(jwk))
  })
