<template>
  <div>
    <h1>ChargEra Summary</h1>
    <p>This is the summary of the ChargEra page.</p>
  </div>

  <div class="summary-extra-box">
      <div class="summary-extra-box__tile">
        <h3 class="summary-extra-box__title">Sessions</h3>
        <h4>{sessions}</h4>
      </div>
      <div class="summary-extra-box__tile">
        <h3 class="summary-extra-box__title">Energy used</h3>
        <h4>{energyUsed}</h4>
      </div>
      <div class="summary-extra-box__tile">
        <h3 class="summary-extra-box__title">Chargera Wallet</h3>
        <h4>{c4evCoins} C4Ev</h4>
      </div>
  </div>
</template>

<script>
export default {
  name: "ChargEraSummary"
};
</script>

<style scoped lang="scss">

.summary-extra-box {
  width: 75%;
  display: inline-flex;
  flex-wrap: wrap;
  background: #0F3153;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  font-family: 'Inter',sans-serif;
  align-items: center;
  font-weight: 700;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 5px;
  margin: 10px auto;
  justify-content: space-around;

  div {
    flex: 1 1 10%;
    min-width: 200px;
  }
  h3 {
    padding: 10px 10px;
    font-size: 1.5rem;
  }
  h4 {
    padding: 10px;
    font-weight: 800;
    font-size: 1.5rem;
  }
  &__tile {
    padding: 10px 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter',sans-serif;
    color: white;
    background: #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
    height: 100%;
    margin: 10px 12px;
  }
}
</style>
