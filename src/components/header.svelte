<script lang="ts">
import { _ } from 'svelte-i18n';

  import { Nav, NavItem, NavLink, Icon, Navbar, NavbarBrand } from 'sveltestrap'
</script>

<div>
  <Navbar color="light" light>
    <NavbarBrand class="me-auto">{$_('brand')}</NavbarBrand>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink title="DD的頻道" href="https://www.twitch.tv/mtow9140" target="_blank"><Icon name="twitch" class="fs-3" style="color: #A970FF"/></NavLink>
      </NavItem>
    </Nav>
  </Navbar>
</div>
