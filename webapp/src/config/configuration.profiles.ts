const mainProfiles: [string, string][] = [ 
  ["testnet", "testnet.json"],
  ["mainnet", "mainnet.json"],
];

let CONFIGURATION_PROFILES: Map<string, string>;

export function getConfigurationProfiles(): Map<string, string> {
  if (!CONFIGURATION_PROFILES) {
    CONFIGURATION_PROFILES = createConfigurationProfiles();
  }
  return CONFIGURATION_PROFILES;
}


export function getIntialProfile(): { name: string, file: string} {
  const prof = mainProfiles[0];
  return {
    name: prof[0],
    file: prof[1]
  }
}


function createConfigurationProfiles(): Map<string, string> {
  const result = new Map<string, string>(mainProfiles);

  const testProfilesActive = process.env.VUE_APP_TEST_PROFILES_ACTIVE;
  if (testProfilesActive) {
    const areTestProfilesActive = Boolean(testProfilesActive);
    if (areTestProfilesActive) {
      result.set("PB Test", "pb_test.json");
    }
  }

  return result;
}