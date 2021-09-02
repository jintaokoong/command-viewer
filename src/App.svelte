<script lang="ts">
  import { Container, Styles } from 'sveltestrap'
  import Header from 'components/header.svelte'
  import Body from 'components/body.svelte'
  import Footer from 'components/footer.svelte'
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { onMount } from 'svelte'
  import CommandService from './services/command-service'
  import { commands } from 'stores/commands'
  import transformer from 'utils/transformer'

  const query = () => {
    commands.update(v => ({ ...v,
      isInitialized: true,
      isLoading: true
    }))
    CommandService.fetchCommands().then((data) => {
      commands.update(v => ({
        ...v,
        data: data.filter(c => c.enabled).map(c => transformer.transform(c)),
      }))
    }).catch((error) => {
      console.error(error)
      commands.update(v => ({
        ...v,
        isError: true,
      }))
    }).finally(() => {
      commands.update(v => ({
        ...v,
        isLoading: false,
      }))
    })
  }

  onMount(() => {
    query();
    window.onfocus = () => {
      query();
    }
  })
</script>

<Container class="d-flex flex-column h-100">
  <main class="flex-shrink-0">
    <Header/>
    <Body />
  </main>
  <Footer/>
</Container>
<SvelteToast
        options={{
    duration: 1000,
    dismissable: false,
    reversed: true,
    intro: { y: 192 },
  }}
/>
<Styles/>

<style>
  :root {
    --toastContainerTop: auto;
    --toastContainerRight: auto;
    --toastContainerBottom: 1rem;
    --toastContainerLeft: calc(50vw - 8rem);
    --toastProgressBackground: transparent;
  }
</style>
