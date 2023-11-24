import {defineStore} from 'pinia';
import apiFactory from '@/api/factory.api';
import {ChargePointDict} from "@/models/ev/chargePointDict";
import {ChargePoint} from "@/models/ev/chargePoint";
import {CreateChargePoint} from "@/models/ev/createChargePoint";
import {UpdateChargePoint} from "@/models/ev/updateChargePoint";
import {CreateTariffGroup} from "@/models/ev/createTariffGroup";
import {UpdateTariffGroup} from "@/models/ev/updateTariffGroup";
import {UpdateChargePointConnector} from "@/models/ev/updateChargePointConnector";


interface ChargerStore {
  chargePoints: ChargePoint[];
  chargePointDicts: ChargePointDict[];
}

export const useChargerStore = defineStore({
  id: 'chargerStore',

  state: (): ChargerStore => ({
    chargePoints: [],
    chargePointDicts: [],
  }),

  actions: {
    async fetchAllChargeStoreData(lockscreen = true) {
      await this.fetchChargePoints(lockscreen);
      await this.fetchChargePointDicts(lockscreen);
      for (const cp of this.chargePoints) {
        if (cp.tariffGroupId) {
          await this.fetchTariffGroupAndTariffs(cp.tariffGroupId, lockscreen);
        }
        await this.fetchAndAssignChargePointConnectors(cp.id, lockscreen);
      }
    },

    async fetchChargePoints(lockscreen = true) {
      const response = await apiFactory.evServiceApi().getChargePoints(lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints = response.data;
      }
    },

    async fetchAndAssignChargePointConnectors(cpId: string, lockscreen = true) {
      const response = await apiFactory.evServiceApi().getChargePointConnectors(cpId, lockscreen);
      if (response.isSuccess() && response.data) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (cpIndex !== -1) {
          this.chargePoints[cpIndex].chargePointConnectors = response.data;
        }
      }
    },

    async addChargePoint(createChargePoint: CreateChargePoint, lockscreen = true) {
      const response = await apiFactory.evServiceApi().createChargePoint(createChargePoint, lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints.push(response.data);
      }
    },

    async updateChargePoint(cpId: string, updateChargePoint: UpdateChargePoint, lockscreen = true) {
      const response = await apiFactory.evServiceApi().updateChargePoint(cpId, updateChargePoint, lockscreen);
      if (response.isSuccess() && response.data) {
        const index = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (index !== -1) {
          this.chargePoints[index] = response.data;
        }
      }
    },

    async removeChargePoint(cpId: string, lockscreen = true) {
      const response = await apiFactory.evServiceApi().deleteChargePoint(cpId, lockscreen);
      if (response.isSuccess()) {
        this.chargePoints = this.chargePoints.filter(cp => cp.id !== cpId);
      }
    },

    async createTariffGroup(createTariffGroup: CreateTariffGroup, lockscreen = true) {
      const response = await apiFactory.evServiceApi().createTariffGroup(createTariffGroup, lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints.forEach(cp => {
          if (cp.tariffGroupId === response.data?.id) {
            cp.tariffGroup = response.data;
          }
        });
      }
    },

    async updateTariffGroup(tgId: number, updateTariffGroup: UpdateTariffGroup, lockscreen = true) {
      const response = await apiFactory.evServiceApi().updateTariffGroup(updateTariffGroup, lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints.forEach(cp => {
          if (cp.tariffGroupId === tgId) {
            cp.tariffGroup = response.data;
          }
        });
      }
    },

    async deleteTariffGroup(tgId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().deleteTariffGroup(tgId, lockscreen);
      if (response.isSuccess()) {
        this.chargePoints.forEach(cp => {
          if (cp.tariffGroupId === tgId) {
            cp.tariffGroup = undefined;
          }
        });
      }
    },

    async fetchTariffGroupAndTariffs(tgId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().getTariffGroup(tgId, lockscreen);
      if (response.isSuccess() && response.data) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.tariffGroupId === tgId);
        if (cpIndex !== -1 && this.chargePoints[cpIndex].tariffGroup) {
          this.chargePoints[cpIndex].tariffGroup = response.data;
          await this.fetchTariffGroupTariffs(tgId, lockscreen)
        }
      }
    },

    async fetchTariffGroup(tgId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().getTariffGroup(tgId, lockscreen);
      if (response.isSuccess() && response.data) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.tariffGroupId === tgId);
        if (cpIndex !== -1 && this.chargePoints[cpIndex].tariffGroup) {
          this.chargePoints[cpIndex].tariffGroup = response.data;
        }
      }
    },

    async fetchTariffGroupTariffs(tgId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().getTariffs(tgId, lockscreen);
      if (response.isSuccess() && response.data) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.tariffGroupId === tgId);
        if (cpIndex !== -1) {
          const tariffGroup = this.chargePoints[cpIndex].tariffGroup;
          if (tariffGroup) {
            tariffGroup.tariffs = response.data;
          }
        }
      }
    },

    // async createTariff(tgId: number, createTariff: CreateTariff, lockscreen = true) {
    //   const response = await apiFactory.evServiceApi().createTariff(createTariff, lockscreen);
    //   if (response.isSuccess() && response.data) {
    //     const tgIndex = this.chargePoints.findIndex(cp => cp.tariffGroupId === tgId);
    //     if (tgIndex !== -1 && this.chargePoints[tgIndex].tariffGroup) {
    //       this.chargePoints[tgIndex].tariffGroup.tariffs.push(response.data);
    //     }
    //   }
    // },

    // async updateTariff(tgId: number, tId: number, updateTariff: UpdateTariff, lockscreen = true) {
    //   const response = await apiFactory.evServiceApi().updateTariff(updateTariff, lockscreen);
    //   if (response.isSuccess() && response.data) {
    //     const tgIndex = this.chargePoints.findIndex(cp => cp.tariffGroupId === tgId);
    //     if (tgIndex !== -1 && this.chargePoints[tgIndex].tariffGroup && this.chargePoints[tgIndex].tariffGroup.tariffs) {
    //       const tIndex = this.chargePoints[tgIndex].tariffGroup.tariffs.findIndex(t => t.id === tId);
    //       if (tIndex !== -1) {
    //         this.chargePoints[tgIndex].tariffGroup.tariffs[tIndex] = response.data;
    //       }
    //     }
    //   }
    // },
    //
    // async deleteTariff(tgId: number, tId: number, lockscreen = true) {
    //   const response = await apiFactory.evServiceApi().deleteTariff(tgId, tId, lockscreen);
    //   if (response.isSuccess()) {
    //     const tgIndex = this.chargePoints.findIndex(cp => cp.tariffGroupId === tgId);
    //     if (tgIndex !== -1 && this.chargePoints[tgIndex].tariffGroup && this.chargePoints[tgIndex].tariffGroup.tariffs) {
    //       this.chargePoints[tgIndex].tariffGroup.tariffs = this.chargePoints[tgIndex].tariffGroup.tariffs.filter(t => t.id !== tId);
    //     }
    //   }
    // },

    async updateChargePointConnector(cpId: string, connectorId: number, updateChargePointConnector: UpdateChargePointConnector, lockscreen = true) {
      const response = await apiFactory.evServiceApi().updateChargePointConnector(cpId, connectorId, updateChargePointConnector, lockscreen);
      if (response.isSuccess() && response.data) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (cpIndex !== -1) {
          const connectorIndex = this.chargePoints[cpIndex].chargePointConnectors?.findIndex(c => c.id === connectorId);
          if (connectorIndex !== undefined && connectorIndex !== -1) {
            const chargePointConnectors = this.chargePoints[cpIndex].chargePointConnectors;
            if (chargePointConnectors) {
              chargePointConnectors[connectorIndex] = response.data;
            }
          }
        }
      }
    },

    async deleteChargePointConnector(cpId: string, connectorId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().deleteChargePointConnector(cpId, connectorId, lockscreen);
      if (response.isSuccess()) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (cpIndex !== -1 && this.chargePoints[cpIndex].chargePointConnectors) {
          this.chargePoints[cpIndex].chargePointConnectors = this.chargePoints[cpIndex].chargePointConnectors?.filter(c => c.id !== connectorId);
        }
      }
    },

    async fetchChargePointDicts(lockscreen = true) {
      const response = await apiFactory.evServiceApi().getChargePointDicts(lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePointDicts = response.data;
      }
    },
  },

  getters: {
    getChargePoints(): ChargePoint[] | undefined {
      return this.chargePoints
    },
    getChargePointDicts(): ChargePointDict[] | undefined {
      return this.chargePointDicts
    },
  },
});
