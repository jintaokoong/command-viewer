<script lang="ts">
  import { Card, CardBody, Col, Container, Icon, Navbar, NavbarBrand, Row, Styles } from 'sveltestrap'
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
    console.log('audio src', src);
    let audio = new Audio(src);
    audio.onended = () => {
      audios.update(a => a.filter(aid => aid !== id))
    }
    audio.play().then(() => {
      audios.update(a => [...a, id]);
    });
  }

  const copy = (source: string) => () => {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        console.log('granted')
        navigator.clipboard.writeText(source).then(() => {
          console.log('copied to clipboard')
          toast.push('copied to clipboard')
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
      console.log(successful)
      if (successful) {
        toast.push('copied to clipboard')
      }
      document.body.removeChild(textArea)
    })
  }
</script>

<main>
  <Container>
    <Navbar color="light" light>
      <NavbarBrand class="me-auto">Command Viewer</NavbarBrand>
    </Navbar>
    <Row class="mt-4" cols={{ lg: 4, md: 2, sm: 1, xs: 1 }}>
      {#each state.data as command}
        <Col class="mb-3">
          <Card>
            <CardBody>
              <div class="d-flex clickable rounded mb-1 justify-content-center align-items-center bg-dark" style="height: 15vh; min-height: 147px" on:click={onPlay(command._id, command.audio.src)}>
                {#if playing.includes(command._id)}
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
  </Container>
</main>
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

  .clickable {
    cursor: pointer;
  }

  .code-container {
    background: beige;
  }

  .title {
    font-size: 1.12rem;
  }

  .description {
    font-size: 0.85rem;
    color: #7c7c7c;
  }
</style>
