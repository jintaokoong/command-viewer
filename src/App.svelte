<script lang="ts">
  import { Alert, Card, CardBody, Col, Container, Icon, Navbar, NavbarBrand, Row, Spinner, Styles } from 'sveltestrap'
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'
  import { onMount } from 'svelte'
  import CommandService from './services/command-service'
  import { commands } from 'stores/commands'
  import transformer from 'utils/transformer'
  import { audios } from 'stores/audio'

  let state = {
    isLoading: false,
    isError: false,
    data: [],
    error: '',
  }
  let playing = [];
  $: playingids = playing.map(p => p.id)

  audios.subscribe(value => {
    playing = value;
  })

  commands.subscribe(value => {
    state = value
  })

  onMount(() => {
    commands.update(v => ({ ...v, isLoading: true }))
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
  })

  const onPlay = (id: string, src: string) => () => {
    let audio = new Audio(src);
    const index = playing.findIndex(a => a.id === id);
    if (index === -1) {
      audio.onended = () => {
        audios.update(a => a.filter(ad => ad.id !== id))
      }
      audio.play().then(() => {
        audios.update(a => [...a, { id: id, audio: audio }]);
      });
    } else {
      const entry = playing[index];
      entry.audio.pause();
      audios.update(a => a.filter(aud => aud.id !== id))
    }
  }

  const copy = (source: string) => () => {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard.writeText(source).then(() => {
          toast.push('複製成功')
        })
      }
    }).catch(() => {
      const textArea = document.createElement('textarea')
      textArea.value = source
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      if (successful) {
        toast.push('複製成功')
      }
      document.body.removeChild(textArea)
    })
  }
</script>

<Container class="d-flex flex-column h-100">
  <main class="flex-shrink-0">
      <Navbar color="light" light>
        <NavbarBrand class="me-auto">指令查看器</NavbarBrand>
      </Navbar>
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
                <Card>
                  <CardBody>
                    <div class="d-flex clickable rounded mb-1 justify-content-center align-items-center bg-dark" style="height: 15vh; min-height: 147px" on:click={onPlay(command._id, command.audio.src)}>
                      {#if playingids.includes(command._id)}
                        <Icon name='pause-circle' class="fs-2" style="color: white"/>
                      {:else}
                        <Icon name='play-circle' class="fs-2" style="color: white"/>
                      {/if}
                    </div>
                    <p class="title mb-1">{command.name}</p>
                    <p class="description mb-1">{command.description}</p>
                    <div class="clickable code-container rounded p-1" on:click={copy(`!s ${command.identifier}`)}>
                      <pre>!s {command.identifier}</pre>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            {/each}
          </Row>
        {/if}
      </div>
  </main>
  <footer class="mt-auto p-2 bg-light  text-center">
    <span class="version">
      v1.0.1
    </span>
  </footer>
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

  p {
    margin: 0;
  }

  pre {
    margin: 0;
  }

  .version {
    font-size: 0.9rem;
  }

  .clickable {
    cursor: pointer;
  }

  .code-container {
    background: beige;
  }

  .loading-message {
    font-size: 1.25rem;
  }

  .title {
    font-size: 1.12rem;
  }

  .description {
    font-size: 0.85rem;
    color: #7c7c7c;
  }
</style>
