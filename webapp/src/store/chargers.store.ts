import {defineStore} from 'pinia';
import apiFactory from '@/api/factory.api';
import {ChargePointDict} from "@/models/ev/chargePointDict";
import {ChargePoint} from "@/models/ev/chargePoint";
import {CreateChargePoint} from "@/models/ev/createChargePoint";
import {UpdateChargePoint} from "@/models/ev/updateChargePoint";
import {CreateTariffGroup} from "@/models/ev/createTariffGroup";
import {UpdateTariffGroup} from "@/models/ev/updateTariffGroup";
import {UpdateChargePointConnector} from "@/models/ev/updateChargePointConnector";
import {CreateChargePointFromDict} from "@/models/ev/createChargePointFromDict";
import {TariffGroup} from "@/models/ev/tariffGroup";
import {CreateTariff} from "@/models/ev/createTariff";

interface ChargerStore {
  chargePoints: ChargePoint[];
  chargePointDicts: ChargePointDict[];
  tariffGroups: TariffGroup[];
  selectedChargePointDict: ChargePointDict;
  selectedTariffGroup: TariffGroup;
  createChargePointFromDict: CreateChargePointFromDict;
}

export const useChargerStore = defineStore({
  id: 'chargerStore',

  state: (): ChargerStore => ({
    chargePoints: [],
    chargePointDicts: [],
    tariffGroups: [],
    createChargePointFromDict: {} as CreateChargePointFromDict,
    selectedChargePointDict: {} as ChargePointDict,
    selectedTariffGroup: {} as TariffGroup,
  }),

  actions: {
    async fetchAllChargeStoreData(lockscreen = true) {
      await this.fetchChargePointDicts(lockscreen);
      await this.fetchChargePoints(lockscreen);
      await this.fetchTariffGroups(lockscreen);
      for (const cp of this.chargePoints) {
        await this.fetchAndAssignChargePointConnectors(cp.id, lockscreen);
      }
      for (const tg of this.tariffGroups) {
        await this.fetchAndAssignTariffsToTariffGroup(tg.id, lockscreen);
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

    async createChargePoint(createChargePoint: CreateChargePoint, lockscreen = true) {
      const response = await apiFactory.evServiceApi().createChargePoint(createChargePoint, lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints.push(response.data);
      }
    },

    async createChargePointFromDict(createChargePointFromDict: CreateChargePointFromDict, lockscreen = true) {
      const response = await apiFactory.evServiceApi().createChargePointFromDict(createChargePointFromDict, lockscreen);
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

    async createTariffGroup(createTariffGroup: CreateTariffGroup, lockscreen = true, onSuccess: ((tariffGroupId: number) => void)) {
      const response = await apiFactory.evServiceApi().createTariffGroup(createTariffGroup, lockscreen);
      if (response.isSuccess() && response.data) {
        this.tariffGroups.push(response.data);
        onSuccess(response.data.id);
      }
    },

    async updateTariffGroup(tgId: number, updateTariffGroup: UpdateTariffGroup, lockscreen = true) {
      const response = await apiFactory.evServiceApi().updateTariffGroup(tgId, updateTariffGroup, lockscreen);
      if (response.isSuccess() && response.data) {
        const index = this.tariffGroups.findIndex(tg => tg.id === tgId);
        if (index !== -1) {
          this.tariffGroups[index] = response.data;
        }
      }
    },

    async deleteTariffGroup(tgId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().deleteTariffGroup(tgId, lockscreen);
      if (response.isSuccess()) {
        this.tariffGroups = this.tariffGroups.filter(tg => tg.id !== tgId);
      }
    },

    async fetchAndAssignTariffsToTariffGroup(tgId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().getTariffs(tgId, lockscreen);
      if (response.isSuccess() && response.data) {
        const tgIndex = this.tariffGroups.findIndex(tg => tg.id === tgId);
        if (tgIndex !== -1) {
          this.tariffGroups[tgIndex].tariffs = response.data;
        }
      }
    },


    async fetchTariffGroups(lockscreen = true) {
      const response = await apiFactory.evServiceApi().getTariffGroups(lockscreen);
      if (response.isSuccess() && response.data) {
        this.tariffGroups = response.data;
      }
    },


    async createTariff(tgId: number, createTariff: CreateTariff, lockscreen = true, onSuccess: () => void) {
      const response = await apiFactory.evServiceApi().createTariff(createTariff, lockscreen);
      if (response.isSuccess() && response.data) {
        const tgIndex = this.tariffGroups.findIndex(tg => tg.id === tgId);
        if (tgIndex !== -1) {
          this.tariffGroups[tgIndex].tariffs.push(response.data);
          onSuccess();
        }
      }
    },

    async updateTariff(tgId: number, tId: number, updateTariff: UpdateTariff, lockscreen = true) {
      const response = await apiFactory.evServiceApi().updateTariff(updateTariff, lockscreen);
      if (response.isSuccess() && response.data) {
        const tgIndex = this.tariffGroups.findIndex(tg => tg.id === tgId);
        if (tgIndex !== -1) {
          const tariffIndex = this.tariffGroups[tgIndex].tariffs.findIndex(t => t.id === tId);
          if (tariffIndex !== -1) {
            this.tariffGroups[tgIndex].tariffs[tariffIndex] = response.data;
          }
        }
      }
    },

    async deleteTariff(tgId: number, tId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().deleteTariff(tgId, tId, lockscreen);
      if (response.isSuccess()) {
        const tgIndex = this.tariffGroups.findIndex(tg => tg.id === tgId);
        if (tgIndex !== -1) {
          this.tariffGroups[tgIndex].tariffs = this.tariffGroups[tgIndex].tariffs.filter(t => t.id !== tId);
        }
      }
    },

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
    getTariffGroups(): TariffGroup[] | undefined {
      return this.tariffGroups;
    },
  },
});
