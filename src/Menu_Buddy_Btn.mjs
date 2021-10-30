import Menu_Buddy from "./Menu_Buddy.mjs";

class Menu_Buddy_Button extends HTMLElement
{
  static name = "menu-buddy-btn";

  constructor() 
  {
    super();
    this.attachShadow({mode: 'open'});

    this.On_Menu_Btn_Click = this.On_Menu_Btn_Click.bind(this);
    this.On_Option_Click = this.On_Option_Click.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  static observedAttributes = ["menu-style-src", "show-pos"];
  attributeChangedCallback(attrName, oldValue, newValue)
  {
    if (attrName == "menu-style-src")
    {
      this.menu_style_src = newValue;
    }
    if (attrName == "show-pos")
    {
      this.show_pos = newValue;
    }
  }

  set menu(value)
  {
    if (this.menu_buddy)
    {
      this.menu_buddy.menu = value;
    }
  }

  On_Menu_Btn_Click(event)
  {
    event.stopPropagation();
    this.menu_buddy.Toggle(this.btn, this.show_pos);
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
    this.btn = document.createElement("button");
    this.btn.append(...this.childNodes);
    this.btn.addEventListener("click", this.On_Menu_Btn_Click);

    this.menu_buddy = new Menu_Buddy(); // document.createElement("menu-buddy");
    this.menu_buddy.id = "btn_menu";
    this.menu_buddy.style_src = this.menu_style_src;
    this.menu_buddy.addEventListener("clickoption", this.On_Option_Click);

    this.shadowRoot.append(this.btn, this.menu_buddy);
  }
}

export default Menu_Buddy_Button;