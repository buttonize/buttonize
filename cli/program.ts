import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export const program = yargs(hideBin(process.argv))
	.scriptName('buttonize')
	.option('profile', {
		type: 'string',
		describe:
			'AWS profile name to used for fetching stack metadata. You can also set `AWS_PROFILE` environment variable instead.'
	})
	.option('region', {
		type: 'string',
		describe:
			'AWS region used for fetching stack metadata. You can also set `AWS_REGION` environment variable instead.'
	})
	.option('verbose', {
		type: 'boolean',
		describe: 'Print verbose logs'
	})
	.group(['region', 'profile', 'verbose', 'help'], 'Global:')
	.middleware(async (argv) => {
		if (argv.verbose) {
			process.env.BTNZ_VERBOSE = '1'
		}
		if (typeof argv.profile !== 'undefined' && argv.profile.length > 0) {
			process.env.AWS_PROFILE = argv.profile
		}
		if (typeof argv.region !== 'undefined' && argv.region.length > 0) {
			process.env.AWS_REGION = argv.region
		}
		if (argv._.length > 0) {
			// const { trackCli } = await import("./telemetry/telemetry.js");
			// trackCli(argv._[0] as string);
		}
	})
	.version(false)
	.epilogue(`Join Buttonize community on Discord https://discord.buttonize.io`)
	.recommendCommands()
	.demandCommand()
	.strict()
	.fail((_, error, yargs) => {
		if (!error) {
			yargs.showHelp()
			process.exit(0)
		}
		throw error
	})

export type Program = typeof program
