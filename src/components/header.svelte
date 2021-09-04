<script lang="ts">
import { _ } from 'svelte-i18n';

  import { Navbar, NavbarBrand } from 'sveltestrap'
</script>

<div>
  <Navbar color="light" light>
    <NavbarBrand class="me-auto">{$_('brand')}</NavbarBrand>
  </Navbar>
</div>


