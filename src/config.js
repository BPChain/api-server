const config = {
  ethereum: {
    privateChain: {
      name:
        'ethereum',
      schema:
        'ethereumschema',
    },
    publicChain: {
      activeMiners: 
      'https://api.nanopool.org/v1/eth/pool/activeminers',
      activeWorkers: 
      'https://api.nanopool.org/v1/eth/pool/activeworkers',
      averageBlockTime:
      'https://api.nanopool.org/v1/eth/network/avgblocktime',
      blockTimeDifficulty: 
      'https://api.nanopool.org/v1/eth/block_stats/0/5',
      hashRate: 
      'https://api.nanopool.org/v1/eth/pool/hashrate',
      timeToNextEpoch:
      'https://api.nanopool.org/v1/eth/network/timetonextepoch',
    },
  },
}

module.exports = config
