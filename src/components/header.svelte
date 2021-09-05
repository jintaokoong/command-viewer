<script lang="ts">
import { _ } from 'svelte-i18n';

  import { Nav, NavItem, NavLink, Icon, Navbar, NavbarBrand } from 'sveltestrap'
</script>

<div>
  <Navbar light style="background-color: #94C6D8">
    <NavbarBrand class="me-auto custom text-light">{$_('brand')}</NavbarBrand>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink title="DD的頻道" href="https://www.twitch.tv/mtow9140" target="_blank"><Icon name="twitch" class="fs-3 text-light"/></NavLink>
      </NavItem>
    </Nav>
  </Navbar>
</div>
