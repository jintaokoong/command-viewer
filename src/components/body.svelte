<script lang="ts">
  import { Alert, Col, Row, Spinner } from 'sveltestrap'
  import CommandCard from 'components/command-card.svelte'
  import { commands } from 'stores/commands'

  let state = {
    isLoading: false,
    isError: false,
    data: [],
    error: '',
  }

  commands.subscribe(value => {
    state = value
  })
</script>

<div class="mt-4">
  {#if state.isLoading && !state.isError}
    <div class="d-flex justify-content-center align-items-center">
      <Spinner size="sm" type="grow" /> <p class="ms-2 loading-message">載入中 請稍後</p>
    </div>
  {:else if state.isError}
    <Alert color="danger">
      <h5 class="alert-heading">歐不 看起來像是出現了錯誤</h5>
      HTTP要求有可能被StreamElements 請通知亨利 謝謝
    </Alert>
  {:else}
    <Row cols={{ lg: 4, md: 2, sm: 1, xs: 1 }}>
      {#each state.data as command}
        <Col class="mb-3">
          <CommandCard command={command}/>
        </Col>
      {/each}
    </Row>
  {/if}
</div>

<style>
  p {
    margin: 0;
  }

  pre {
    margin: 0;
  }

  .loading-message {
    font-size: 1.25rem;
  }
</style>
