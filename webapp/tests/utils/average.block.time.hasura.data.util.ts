export function createAveragetBlockTimeResponseData(averagetBlockTime: number) {
  return {
    data: {
      averageBlockTime: [
        {
          averageTime: averagetBlockTime
        }
      ]
    }
  }
}


