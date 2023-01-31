import Menu_Buddy from "./Menu_Buddy.mjs";
import Utils from "./Utils.js";

class Menu_Buddy_Button extends HTMLElement
{
  static tname = "menu-buddy-btn";

  constructor() 
  {
    super();
    this.attachShadow({mode: 'open'});

    this.setAttribute("show-pos", "right");

    this.On_Menu_Btn_Click = this.On_Menu_Btn_Click.bind(this);
    this.On_Option_Click = this.On_Option_Click.bind(this);
    this.On_Document_Click = this.On_Document_Click.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  set menu(value)
  {
    this.menu_def = value;
    if (this.menu_buddy)
    {
      this.menu_buddy.menu = value;
    }
  }

  set width(value)
  {
    this.menu_width = value;
    if (this.menu_buddy)
    {
      this.menu_buddy.width = this.menu_width;
    }
  }

  On_Document_Click(event)
  {
    const path = event.composedPath();
    if (!path.includes(this) && !path.includes(this.menu_buddy))
    {
      this.menu_buddy.Hide();
    }
  }

  On_Menu_Btn_Click(event)
  {
    this.menu_buddy.Toggle(this.btn, this.getAttribute("show-pos"));
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
    document.addEventListener("click", this.On_Document_Click);

    const btn_style_src = this.getAttribute("btn-style-src");
    if (btn_style_src)
    {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = btn_style_src;
      this.shadowRoot.append(link);
    }

    this.btn = document.createElement("button");
    this.btn.id = "btn";
    this.btn.append(...this.childNodes);
    this.btn.addEventListener("click", this.On_Menu_Btn_Click);

    this.menu_buddy = new Menu_Buddy();
    this.menu_buddy.width = this.menu_width;
    this.menu_buddy.id = "btn_menu";
    if (this.hasAttribute("menu-style-src"))
    {
      this.menu_buddy.setAttribute("style-src", this.getAttribute("menu-style-src"));
    }
    this.menu_buddy.menu = this.menu_def;
    this.menu_buddy.addEventListener("clickoption", this.On_Option_Click);

    this.shadowRoot.append(this.btn, this.menu_buddy);
  }
}

Utils.Register_Element(Menu_Buddy_Button);

export default Menu_Buddy_Button;