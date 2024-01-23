import {defineStore} from 'pinia';
import apiFactory from '@/api/factory.api';
import {ChargePointDict} from "@/models/chargePointDict";
import {ChargePoint} from "@/models/chargePoint";
import {CreateChargePoint} from "@/models/createChargePoint";
import {UpdateChargePoint} from "@/models/updateChargePoint";
import {CreateTariffGroup} from "@/models/createTariffGroup";
import {UpdateTariffGroup} from "@/models/updateTariffGroup";
import {UpdateChargePointConnector} from "@/models/updateChargePointConnector";
import {CreateChargePointFromDict} from "@/models/createChargePointFromDict";
import {TariffGroup} from "@/models/tariffGroup";
import {CreateTariff} from "@/models/createTariff";
import {Tariff} from "@/models/tariff";
import {CreateTariffForChargePoint} from "@/models/createTariffForChargePoint";
import {ChargePointChangeActiveState} from "@/models/ChargePointChangeActiveState";
import {ChargePointEvse} from "@/models/chargePointEvse";

interface OwnerStore {
  selectedTariff: Tariff | null;
  chargePoints: ChargePoint[];
  chargePointDicts: ChargePointDict[];
  tariffGroups: TariffGroup[];
  selectedChargePointDict: ChargePointDict | null;
  selectedTariffGroup: TariffGroup | null;
  createChargePointFromDict: CreateChargePointFromDict,
  selectedChargePoint: ChargePoint | null;
}

export const useOwnerStore = defineStore({
  id: 'ownerStore',

  state: (): OwnerStore => ({
    chargePoints: [],
    chargePointDicts: [],
    tariffGroups: [],
    createChargePointFromDict: {} as CreateChargePointFromDict,
    selectedChargePointDict: null,
    selectedTariffGroup: null,
    selectedChargePoint: null,
    selectedTariff: null,
  }),

  actions: {
    async fetchAllChargeStoreData(lockscreen = true) {
      await this.fetchChargePointDicts(lockscreen);
      await this.fetchChargePointsAll(lockscreen);
    },

    async fetchChargePointsAll(lockscreen = true) {
      const response = await apiFactory.evServiceApi().getChargePointsAll(lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints = response.data;
      }
    },

    async fetchAndAssignChargePointConnectors(cpId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().getChargePointConnectors(cpId, lockscreen);
      if (response.isSuccess() && response.data) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (cpIndex !== -1) {
          this.chargePoints[cpIndex].chargePointEvses = response.data;
        }
      }
    },

    async createChargePoint(createChargePoint: CreateChargePoint, lockscreen = true) {
      const response = await apiFactory.evServiceApi().createChargePoint(createChargePoint, lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints.push(response.data);
      }
    },

    async createChargePointFromDictFn(lockscreen = true, onSuccess?: (() => void)) {
      this.createChargePointFromDict.sourceChargePointDictId = this.selectedChargePointDict?.id;
      const response = await apiFactory.evServiceApi().createChargePointFromDict(this.createChargePointFromDict, lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePoints.push(response.data);
        this.selectedChargePoint = response.data;
        this.createChargePointFromDict = {} as CreateChargePointFromDict;
        this.selectedChargePointDict = null;
        if (onSuccess) {
          onSuccess();
        }
      }
    },

    async updateChargePoint(cpId: number, updateChargePoint: UpdateChargePoint, lockscreen = true) {
      const response = await apiFactory.evServiceApi().updateChargePoint(cpId, updateChargePoint, lockscreen);
      if (response.isSuccess() && response.data) {
        const index = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (index !== -1) {
          this.chargePoints[index] = response.data;
        }
      }
    },

    async deleteChargePoint(chargePoint: ChargePoint, lockscreen = true, onSuccess?: (() => void)) {
      const response = await apiFactory.evServiceApi().deleteChargePoint(chargePoint, lockscreen);
      if (response.isSuccess()) {
        this.chargePoints = this.chargePoints.filter(cp => cp.id !== chargePoint.id);
        if (onSuccess) {
          onSuccess();
        }
      }
    },

    async getQrCode(evse: ChargePointEvse) {
      const response = await apiFactory.evServiceApi().getQrCodeLinkForEvse(evse.url, true);
      if (response.isSuccess() && response.data) {
        const chargePointIndex = this.chargePoints.findIndex(cp => cp.id === evse.chargePointId);
        if (chargePointIndex !== -1) {
          const evseIndex = this.chargePoints[chargePointIndex].chargePointEvses?.findIndex(c => c.id === evse.id);
          if (evseIndex !== undefined && evseIndex !== -1) {
            const chargePointEvses = this.chargePoints[chargePointIndex].chargePointEvses;
            console.log(response.data.link);
            if (chargePointEvses) {
              chargePointEvses[evseIndex].qrCodeLink = response.data.link;
            }
          }
        }
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

    async fetchTariffGroups(lockscreen = true) {
      const response = await apiFactory.evServiceApi().getTariffGroups(lockscreen);
      if (response.isSuccess() && response.data) {
        this.tariffGroups = response.data;
      }
    },


    async createTariff(tgId: number, createTariff: CreateTariff, lockscreen = true, onSuccess: () => void) {
      const response = await apiFactory.evServiceApi().createTariff(tgId, createTariff, lockscreen);
      if (response.isSuccess() && response.data) {
        const tgIndex = this.tariffGroups.findIndex(tg => tg.id == tgId);
        if (!this.tariffGroups[tgIndex].tariffs) {
          this.tariffGroups[tgIndex].tariffs = [];
        }
        if (tgIndex !== -1) {
          this.tariffGroups[tgIndex].tariffs.push(response.data);
        }
        onSuccess();
      }
    },

    async updateTariff(tgId: number, tId: number, updateTariff: UpdateTariff, lockscreen = true, onSuccess: () => void) {
      const response = await apiFactory.evServiceApi().updateTariff(tgId, tId, updateTariff, lockscreen);
      if (response.isSuccess() && response.data) {
        const tgIndex = this.tariffGroups.findIndex(tg => tg.id === tgId);
        if (tgIndex !== -1) {
          const tariffIndex = this.tariffGroups[tgIndex].tariffs.findIndex(t => t.id === tId);
          if (tariffIndex !== -1) {
            this.tariffGroups[tgIndex].tariffs[tariffIndex] = response.data;
          }
        }
        this.selectedTariff = null;
        onSuccess();
      }
    },

    async changeChargePointActiveState(cpId: number, chargePointChangeActiveState: ChargePointChangeActiveState, lockscreen = true, onSuccess?: () => void) {
      const response = await apiFactory.evServiceApi().changeChargePointActiveState(cpId, chargePointChangeActiveState, lockscreen);
      if (response.isSuccess()) {
        const index = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (index !== -1) {
          this.chargePoints[index].active = chargePointChangeActiveState.active;
        }

        if (onSuccess) {
          onSuccess();
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

    async createTariffForChargePoint(cpId: number, createTariffForChargePointDto: CreateTariffForChargePoint, lockscreen = true, onSuccess: () => void) {
      const response = await apiFactory.evServiceApi().createTariffForChargePoint(cpId, createTariffForChargePointDto, lockscreen);
      if (response.isSuccess() && response.data) {
        const newTariff = response.data.tariff;
        const newTariffGroup = response.data.tariffGroup;

        if (newTariffGroup) {
          newTariffGroup.tariffs = [newTariff];
          this.tariffGroups.push(newTariffGroup);
        }

        const cpIndex = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (cpIndex !== -1) {
          this.chargePoints[cpIndex].tariffGroupId = newTariffGroup.id;
          await this.updateChargePoint(cpId, { ...this.chargePoints[cpIndex], tariffGroupId: newTariffGroup.id });
        }

        onSuccess();
      }
    },

    async updateChargePointConnector(cpId: number, connectorId: number, updateChargePointConnector: UpdateChargePointConnector, lockscreen = true) {
      const response = await apiFactory.evServiceApi().updateChargePointConnector(cpId, connectorId, updateChargePointConnector, lockscreen);
      if (response.isSuccess() && response.data) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (cpIndex !== -1) {
          const connectorIndex = this.chargePoints[cpIndex].chargePointEvses?.findIndex(c => c.id === connectorId);
          if (connectorIndex !== undefined && connectorIndex !== -1) {
            const chargePointConnectors = this.chargePoints[cpIndex].chargePointEvses;
            if (chargePointConnectors) {
              chargePointConnectors[connectorIndex] = response.data;
            }
          }
        }
      }
    },

    async deleteChargePointConnector(cpId: number, connectorId: number, lockscreen = true) {
      const response = await apiFactory.evServiceApi().deleteChargePointConnector(cpId, connectorId, lockscreen);
      if (response.isSuccess()) {
        const cpIndex = this.chargePoints.findIndex(cp => cp.id === cpId);
        if (cpIndex !== -1 && this.chargePoints[cpIndex].chargePointEvses) {
          this.chargePoints[cpIndex].chargePointEvses = this.chargePoints[cpIndex].chargePointEvses?.filter(c => c.id !== connectorId);
        }
      }
    },

    async fetchChargePointDicts(lockscreen = true) {
      const response = await apiFactory.evServiceApi().getChargePointDicts(lockscreen);
      if (response.isSuccess() && response.data) {
        this.chargePointDicts = response.data;
      }
    },

    getTariffForChargePoint(cpId: number) {
      const chargePoint = this.chargePoints.find(cp => cp.id === cpId);
      if (!chargePoint || chargePoint.tariffGroupId === undefined) return null;

      const tariffGroup = this.tariffGroups.find(tg => tg.id === chargePoint.tariffGroupId);
      if (!tariffGroup || !tariffGroup.tariffs) return null;

      const now = new Date();

      return tariffGroup.tariffs.find(tariff =>
        tariff.active &&
        (!tariff.startDate || new Date(tariff.startDate) <= now) &&
        (!tariff.endDate || new Date(tariff.endDate) >= now)
      );
    },
  },

  getters: {
    getChargePoints(): ChargePoint[] | undefined {
      return this.chargePoints;
    },
    getChargePointDicts(): ChargePointDict[] | undefined {
      return this.chargePointDicts;
    },
    getTariffGroups(): TariffGroup[] | undefined {
      return this.tariffGroups;
    },
    getSelectedChargePoint(): ChargePoint | null {
      return this.selectedChargePoint;
    }
  },
});
