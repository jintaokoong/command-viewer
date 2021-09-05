<script lang="ts">
  import { _ }from 'svelte-i18n'
  import { CardBody, Icon } from 'sveltestrap'
  import { toast } from '@zerodevx/svelte-toast'
  import { audios } from 'stores/audio'

  export let command
  let playing = []

  $: playingids = playing.map(p => p.id)

  audios.subscribe(value => {
    playing = value
  })

  const onPlay = (id: string, src: string) => () => {
    let audio = new Audio(src)
    const index = playing.findIndex(a => a.id === id)
    if (index === -1) {
      audio.onended = () => {
        audio.removeAttribute('src')
        audio.load()
        audio.remove()
        audios.update(a => a.filter(ad => ad.id !== id))
      }
      audio.play().then(() => {
        audios.update(a => [...a, { id: id, audio: audio }])
      })
    } else {
      const entry = playing[index]
      entry.audio.pause()
      entry.audio.removeAttribute('src')
      entry.audio.load()
      entry.audio.remove()
      audios.update(a => a.filter(aud => aud.id !== id))
    }
  }

  const copy = (source: string) => () => {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard.writeText(source).then(() => {
          toast.push($_('copy_success_message'))
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
        toast.push($_('copy_success_message'))
      }
      document.body.removeChild(textArea)
    })
  }
</script>

<div class="card bg-card">
  <CardBody>
    <div class="d-flex clickable rounded mb-1 justify-content-center align-items-center bg-media"
         style="height: 15vh; min-height: 147px" on:click={onPlay(command._id, command.audio.src)}>
      <Icon name='{playingids.includes(command._id) ? "pause-circle" : "play-circle"}' class="fs-2"
            style="color: white"/>
    </div>
    <p class="title mb-1">{command.name}</p>
    <p class="text-smaller mb-1 description">{command.description}</p>
    <div class="d-flex flex-row align-items-center justify-content-between mb-1">
      <div class="d-flex flex-row align-items-center" title="{$_('cooldown_hint')}">
        <Icon name="clock-history" style="font-size: 0.8rem;"/>
        <span class="ms-2 text-smaller">{command.cooldown.global}{$_('duration_text')}</span>
      </div>
      <div class="text-smaller">{command.cost}{$_('currency')}</div>
    </div>
    <div class="clickable code-container rounded p-1" on:click={copy(`!s ${command.identifier}`)}>
      <pre>!s {command.identifier}</pre>
    </div>
  </CardBody>
</div>

<style>
  p {
    margin: 0;
  }

  pre {
    margin: 0;
  }

  .bg-card {
    background-color: #F1FAFA !important;
  }

  .bg-media {
    background-color: #608ABB;
  }

  .clickable {
    cursor: pointer;
  }

  .code-container {
    background: #608ABB;
    color: white;
  }

  .title {
    font-size: 1.12rem;
  }

  .text-smaller {
    font-size: 0.85rem;
  }

  .description {
    color: #646464;
  }
</style>
