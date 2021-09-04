<script lang="ts">
  import { Alert, Col, Row, Spinner } from 'sveltestrap'
  import CommandCard from 'components/command-card.svelte'
  import { commands } from 'stores/commands'
  import { _ } from 'svelte-i18n';

  let state = {
    isInitialized: false,
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
  {#if !state.isInitialized && state.isLoading && !state.isError}
    <div class="d-flex justify-content-center align-items-center">
      <Spinner size="sm" type="grow" /> <p class="ms-2 loading-message">{$_('loading_message')}</p>
    </div>
  {:else if state.isError}
    <Alert color="danger">
      <h5 class="alert-heading">{$_('error_title')}</h5>
      {$_('error_prompt_message')}
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

  .loading-message {
    font-size: 1.25rem;
  }
</style>
