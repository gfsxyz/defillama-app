import chainMetadata from '../../.cache/chains.json'
import protocolMetadata from '../../.cache/protocols.json'

const PROTOCOLS_DATA_URL = 'https://api.llama.fi/config/smol/appMetadata-protocols.json'
const CHAINS_DATA_URL = 'https://api.llama.fi/config/smol/appMetadata-chains.json'

interface IChainMetadata {
	stablecoins?: boolean
	dexs?: boolean
	name: string
	activeUsers?: boolean
	fees?: boolean
	chainFees?: boolean
	perps?: boolean
	dexAggregators?: boolean
	options?: boolean
	perpsAggregators?: boolean
	bridgeAggregators?: boolean
	inflows?: boolean
	chainAssets?: boolean
	gecko_id?: string
	tokenSymbol?: string
	github?: boolean
	id: string
}

interface IProtocolMetadata {
	name?: string
	tvl?: boolean
	yields?: boolean
	forks?: boolean
	liquidity?: boolean
	raises?: boolean
	fees?: boolean
	revenue?: boolean
	holdersRevenue?: boolean
	dexs?: boolean
	perps?: boolean
	dexAggregators?: boolean
	options?: boolean
	perpsAggregators?: boolean
	bridgeAggregators?: boolean
	displayName?: string
	chains?: Array<string>
	hacks?: boolean
	activeUsers?: boolean
	governance?: boolean
	expenses?: boolean
	treasury?: boolean
	nfts?: boolean
	emissions?: boolean
	bribeRevenue?: boolean
	tokenTax?: boolean
	bridges?: boolean
	stablecoins?: boolean
}

const metadataCache: {
	chainMetadata: Record<string, IChainMetadata>
	protocolMetadata: Record<string, IProtocolMetadata>
} = {
	chainMetadata,
	protocolMetadata
}

setInterval(async () => {
	const fetchJson = async (url) => fetch(url).then((res) => res.json())

	const [protocols, chains] = await Promise.all([fetchJson(PROTOCOLS_DATA_URL), fetchJson(CHAINS_DATA_URL)])

	const protocolKeys = Object.keys(protocols)
	const chainKeys = Object.keys(chains)
	const protocolKeySet = new Set(protocolKeys)
	const chainKeySet = new Set(chainKeys)

	// Remove any keys that are no longer in the new data
	for (const key in metadataCache.protocolMetadata) {
		if (!protocolKeySet.has(key)) delete metadataCache.protocolMetadata[key]
	}

	for (const key in metadataCache.chainMetadata) {
		if (!chainKeySet.has(key)) delete metadataCache.chainMetadata[key]
	}

	// Add any new keys that are in the new data
	protocolKeys.forEach((key) => {
		metadataCache.protocolMetadata[key] = protocols[key]
	})

	chainKeys.forEach((key) => {
		metadataCache.chainMetadata[key] = chains[key]
	})
}, 60 * 60 * 1000)

export default metadataCache
