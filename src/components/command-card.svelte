<script lang="ts">
  import { Card, CardBody, Icon } from 'sveltestrap'
  import { toast } from '@zerodevx/svelte-toast'
  import { audios } from 'stores/audio'

  export let command;
  let playing = [];

  $: playingids = playing.map(p => p.id)

  audios.subscribe(value => {
    playing = value;
  })

  const onPlay = (id: string, src: string) => () => {
    let audio = new Audio(src);
    const index = playing.findIndex(a => a.id === id);
    if (index === -1) {
      audio.onended = () => {
        audio.removeAttribute('src')
        audio.load()
        audio.remove()
        audios.update(a => a.filter(ad => ad.id !== id))
      }
      audio.play().then(() => {
        audios.update(a => [...a, { id: id, audio: audio }]);
      });
    } else {
      const entry = playing[index];
      entry.audio.pause();
      entry.audio.removeAttribute('src')
      entry.audio.load()
      entry.audio.remove();
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

<style>
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
