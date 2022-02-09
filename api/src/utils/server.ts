import mercurius, {
  MercuriusContext,
  onResolutionHookHandler,
  preParsingHookHandler,
} from 'mercurius'
import { ApplyPolicyHandler, AuthContextHandler } from 'mercurius-auth'
import crypto from 'crypto'
import { context as appContext } from '../context'
import { getUserFromToken } from '../utils'

const { ErrorWithProps } = mercurius

export const preParsingHook: preParsingHookHandler<MercuriusContext> = async (
  _schema,
  source,
  context,
) => {
  const stdoutLine = '-'.repeat(process.stdout.columns)

  // @ts-ignore
  const reqId = context.requestId

  console.info(`
${stdoutLine}
Stage: START
Request ID: ${reqId}
Auth: ${context.auth}
Source: ${source}
${stdoutLine}
`)
}

export const onResolutionHook: onResolutionHookHandler<
  MercuriusContext
> = async (execution, context) => {
  const stdoutLine = '-'.repeat(process.stdout.columns)

  // @ts-ignore
  const reqId = context.requestId

  console.info(`
${stdoutLine}
Stage: END
Request ID: ${reqId}
Auth: ${JSON.stringify(context.auth)}
Result: ${JSON.stringify(execution.data)}
Errors: ${JSON.stringify(execution.errors)}
${stdoutLine}
`)
}

export const setupRequestContext = () => {
  const requestId = crypto.randomBytes(4).toString('hex')

  return { ...appContext, requestId }
}

export const authContextHandler: AuthContextHandler<MercuriusContext> = async (
  context,
) => {
  const authToken =
    context.reply.request.headers['Authorization'] ||
    context.reply.request.headers['authorization']

  if (!authToken) return

  try {
    const authContext = await getUserFromToken(
      Array.isArray(authToken) ? authToken[0] : authToken,
    )

    return authContext
  } catch (e) {
    console.error({ e })
  }
}

export const applyPolicyHandler: ApplyPolicyHandler<MercuriusContext> = async (
  policy,
  _parent,
  _args,
  context,
  info,
) => {
  const needsAuth = !policy?.public

  const isAuth = Boolean(context.auth?.user)

  if (needsAuth && !isAuth) {
    return new ErrorWithProps(
      `User not authenticated to access ${info.fieldName}`,
      {},
      401,
    )
  }

  return true
}
