import Menu_Buddy from "./Menu_Buddy.mjs";

class Menu_Buddy_Panel extends HTMLElement
{
  static tname = "menu-buddy-panel";

  constructor() 
  {
    super();
    this.attachShadow({mode: 'open'});
    this.z_index_show = "1";
    this.z_index_hide = "-1";
    this.timeout_hide = 500;

    this.Show = this.Show.bind(this);
    this.Hide = this.Hide.bind(this);
    this.On_Option_Click = this.On_Option_Click.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  /*static observedAttributes = ["menu-style-src", "show-pos"];
  attributeChangedCallback(attrName, oldValue, newValue)
  {
    if (attrName == "menu-style-src")
    {
      this.menu_style_src = newValue;
    }
  }*/

  set menu(value)
  {
    if (this.menu_buddy)
    {
      this.menu_buddy.menu = value;
    }
  }
  
  get fixed_width()
  {
    return this.hasAttribute("fixed-width") ? this.getAttribute("fixed-width") : "200px";
  }

  Show()
  {
    this.menu_buddy.style.width = this.fixed_width;
    this.menu_buddy.Close_All();
    this.menu_buddy.Open(this.menu_buddy.root_div, null);

    this.screen.style.zIndex = this.z_index_show;
    this.screen.style.backgroundColor = "#0008";
  }

  Hide()
  {
    this.menu_buddy.style.width = null;
    this.menu_buddy.Close_All();
    this.screen.style.backgroundColor = "#0000";
    setTimeout(() => this.screen.style.zIndex = this.z_index_hide, this.timeout_hide);
  }

  Toggle()
  {
    let res;

    if (this.menu_buddy.style.width == "0px" || this.menu_buddy.style.width == "")
    {
      this.menu_buddy.Show();
      res = true;
    }
    else
    {
      this.menu_buddy.Hide();
      res = false;
    }

    return res;
  }

  On_Option_Click(event)
  {
    this.menu_buddy.Hide();
    const option = event.detail;
    const new_event = new CustomEvent("clickoption", {detail: option});
    this.dispatchEvent(new_event);
  }

  Render()
  {
    this.menu_buddy = new Menu_Buddy();
    this.menu_buddy.fixed_width = this.fixed_width;
    this.menu_buddy.Show = this.Show;
    this.menu_buddy.Hide = this.Hide;
    this.menu_buddy.id = "menu_buddy";
    this.menu_buddy.style_src = this.getAttribute("menu-style-src");
    this.menu_buddy.addEventListener("clickoption", this.On_Option_Click);

    this.screen = this.Render_Screen();
    this.shadowRoot.append(this.screen, this.menu_buddy);
  }

  Render_Screen()
  {
    const screen = document.createElement("div");
    screen.style.transition = "background-color 0.5s";
    screen.style.position = "absolute";
    screen.style.left = "0px";
    screen.style.top = "0px";
    screen.style.width = "100%";
    screen.style.height = "100%";
    screen.style.backgroundColor = "#0000";
    screen.style.zIndex = "-1";

    return screen;
  }
}

export default Menu_Buddy_Panel;