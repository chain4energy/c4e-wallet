import {config, shallowMount} from "@vue/test-utils";
import BackCloseBar from "@/components/BackCloseBar.vue";
import IconComponent from "@/components/features/IconComponent.vue";

config.global.mocks = {
  $t: (tKey: string) => tKey // just return translation key
};
describe('BackCloseBar_Component', () => {
  it('should render correct contents', async  () => {
    // const mockLogout = jest.fn();
    const wrapper = shallowMount(BackCloseBar);
    let iconComponents = wrapper.findAllComponents(IconComponent);
    expect(iconComponents[0]).toBeDefined();
    expect(iconComponents[1]).toBeDefined();
    iconComponents[0].trigger("click"); //simulate click
    await wrapper.vm.$nextTick(); // Wait until $emits have been handled
    expect(wrapper.emitted().back).toBeTruthy();
    iconComponents[1].trigger("click"); //simulate click
    await wrapper.vm.$nextTick(); // Wait until $emits have been handled
    expect(wrapper.emitted().close).toBeTruthy();
  })
})

