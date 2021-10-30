
  class Menu_Buddy extends HTMLElement
  {
    static name = "menu-buddy";

    constructor() 
    {
      super();
      this.attachShadow({mode: 'open'});
      this.On_Open_Btn_Click = this.On_Open_Btn_Click.bind(this);
      this.Toggle = this.Toggle.bind(this);
      this.Hide = this.Hide.bind(this);
      this.On_Select_Btn_Click = this.On_Select_Btn_Click.bind(this);
    }

    connectedCallback()
    {
      this.Render();
    }

    static observedAttributes = ["style-src", "show"];
    attributeChangedCallback(attrName, oldValue, newValue)
    {
      if (attrName == "style-src")
      {
        this.style_src = newValue;
      }
      else if (attrName == "show")
      {
        this.show = newValue;
      }
    }

    set menu(value)
    {
      this.menu_def = value;
      this.Render();
    }

    // Events =====================================================================================

    On_Select_Btn_Click(event, option)
    {
      const new_event = new CustomEvent("clickoption", {detail: option});
      this.dispatchEvent(new_event);
    }

    On_Open_Btn_Click(event, menu_div, option_div)
    {
      this.Open(option_div, menu_div);
    }

    On_This_Click(event)
    {
      event.stopPropagation();
    }

    // Rendering ==================================================================================

    Open(open_elem, close_elem)
    {
      if (close_elem)
      {
        close_elem.style.width = "0px";
      }
      if (open_elem)
      {
        open_elem.style.width = this.offsetWidth + "px";
      }
    }

    Close_All()
    {
      for (const menu_div of this.shadowRoot.children)
      {
        menu_div.style.width = "0px";
      }
    }

    Render()
    {
      this.addEventListener("click", this.On_This_Click);

      if (this.style_src)
      {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = this.style_src;
        this.shadowRoot.replaceChildren(link);
      }

      this.root_div = this.Create_Menu(this.shadowRoot, this.menu_def);
      if (this.show)
      {
        this.Show();
      }
    }

    Create_Menu(parent, menu, is_closed, parent_div)
    {
      let menu_div;

      if (menu)
      {
        menu_div = document.createElement("div");
        menu_div.style.width = "0px";
        menu_div.id = menu.id;
        menu_div.classList.add(menu.class_name);
        menu.elem = menu_div;
        parent.append(menu_div);

        const close_btn = document.createElement("button");
        close_btn.style.whiteSpace = "nowrap";
        if (parent_div)
        {
          close_btn.innerHTML = "<span class='menu_title_prev'>&bigtriangleup;</span><span>" + menu.title + "</span>";
          close_btn.addEventListener("click", (event) => this.On_Open_Btn_Click(event, menu_div, parent_div));
        }
        else
        {
          close_btn.innerText = menu.title;
        }
        close_btn.classList.add("menu_title");
        menu_div.append(close_btn);

        for (const option of menu.options)
        {
          let option_btn;

          if (option.options)
          {
            option_btn = document.createElement("button");
            option_btn.style.whiteSpace = "nowrap";
            option_btn.innerHTML = "<span>" + option.title + "</span><span class='menu_option_next'>&bigtriangleup;</span>";
            const option_div = this.Create_Menu(parent, option, true, menu_div);
            option_btn.addEventListener("click", (event) => this.On_Open_Btn_Click(event, menu_div, option_div));
          }
          else if (typeof(option.title) == "object")
          {
            option_btn = option.title;
          }
          else
          {
            option_btn = document.createElement("button");
            option_btn.style.whiteSpace = "nowrap";
            option_btn.innerText = option.title;
            option_btn.addEventListener("click", event => this.On_Select_Btn_Click(event, option));
          }
          option_btn.classList.add("menu_option");
          menu_div.append(option_btn);
        }
      }

      return menu_div;
    }

    Toggle(src_elem, pos_str)
    {
      let res;

      if (this.style.display == "inline-block")
      {
        this.Hide();
        res = false;
      }
      else
      {
        this.Show(src_elem, pos_str);
        res = true;
      }

      return res;
    }

    Hide()
    {
      this.style.display = "none";
    }

    Show(src_elem, pos_str)
    {
      this.style.left = "";
      this.style.top = "";
      this.Close_All();
      this.style.display = "inline-block";
      this.Open(this.root_div, null);

      const this_rect = this.getBoundingClientRect();
      let x = this_rect.x;
      let y = this_rect.y;
      if (src_elem)
      {
        const src_rect = src_elem.getBoundingClientRect();
        if (pos_str == "top")
        {
          x = src_rect.left;
          y = src_rect.top - this_rect.height;
        }
        if (pos_str == "bottom")
        {
          x = src_rect.left;
          y = src_rect.bottom;
        }
        if (pos_str == "left")
        {
          x = src_rect.left - this_rect.width;
          y = src_rect.top;
        }
        if (pos_str == "right")
        {
          x = src_rect.right;
          y = src_rect.top;
        }
      }
      this.style.left = x + "px";
      this.style.top = y + "px";

      this.Confine();
    }

    Confine()
    {
      const padding = 10;
      const doc_rect = window.document.body.getBoundingClientRect();
      const this_rect = this.getBoundingClientRect();
      let x = this_rect.x;
      let y = this_rect.y;

      if (this_rect.right + padding > doc_rect.right)
      {
        x -= this_rect.right - doc_rect.right + padding;
      }
      if (this_rect.left - padding < doc_rect.left)
      {
        x += doc_rect.left - this_rect.left + padding;
      }
      if (this_rect.bottom + padding > doc_rect.bottom)
      {
        y -= this_rect.bottom - doc_rect.bottom + padding;
      }
      if (this_rect.top + padding < doc_rect.top)
      {
        y += doc_rect.top - this_rect.top + padding;
      }
      this.style.left = x + "px";
      this.style.top = y + "px";
    }
  }

  export default Menu_Buddy;