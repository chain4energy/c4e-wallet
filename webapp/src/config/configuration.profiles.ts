const mainnetFile = "mainnet.json";
const testnetFile = "testnet.json";
const devFile = "dev.json";
const pbNetFile = "pb_test.json";
const internalTestnetFile = "int-testnet.json";

let  initialProfile: { name: string, file: string};
let CONFIGURATION_PROFILES: Map<string, string>;

export function getConfigurationProfiles(): Map<string, string> {
  if (!CONFIGURATION_PROFILES || CONFIGURATION_PROFILES.size < 2) {
    CONFIGURATION_PROFILES = createConfigurationProfiles();
  }
  return CONFIGURATION_PROFILES;
}


export function getIntialProfile(): { name: string, file: string} {
  if (!initialProfile) {
    getConfigurationProfiles();
  }
  return initialProfile
}

function getProfile(fileName: string) {
  return require("@/config/json/" + fileName);
}

function createConfigurationProfiles(): Map<string, string> {
  const result = new Map<string, string>();
  const allProfiles = new Map<string, any>();
  const mainnet = getProfile(mainnetFile);
  const testnet = getProfile(testnetFile);
  const devnet = getProfile(devFile);

  result.set(mainnet.networkName, mainnetFile);
  result.set(testnet.networkName, testnetFile);
  result.set(devnet.networkName, devFile);

  allProfiles.set(mainnetFile, mainnet);
  allProfiles.set(testnetFile, testnet);
  allProfiles.set(devFile, devnet);
  const testProfilesActive = process.env.VUE_APP_TEST_PROFILES_ACTIVE;

  if (testProfilesActive) {
    const areTestProfilesActive = Boolean(testProfilesActive);
    if (areTestProfilesActive) {
      const pb = getProfile(pbNetFile);
      result.set(pb.networkName, pbNetFile);
      allProfiles.set(pbNetFile, pb);

      const inetrnal = getProfile(internalTestnetFile);
      result.set(inetrnal.networkName, internalTestnetFile);
      allProfiles.set(internalTestnetFile, inetrnal);

    }
  }

  for (const [key, value] of allProfiles.entries()) {
    console.log();
    if (value.isMainNetwork) {
      initialProfile = { name: value.networkName, file: key};
      break;
    }
  }
  if (!initialProfile) {
    initialProfile = { name: mainnet.networkName, file: mainnetFile};
  }

  return result;
}
