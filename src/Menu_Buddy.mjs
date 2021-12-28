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

    set width(value)
    {
      this.menu_width = value;
      this.style.width = this.menu_width;
    }

    // Events =====================================================================================

    On_Select_Btn_Click(event, option)
    {
      const new_event = new CustomEvent("clickoption", {detail: option});
      this.dispatchEvent(new_event);

      if (option.on_click_fn)
      {
        option.on_click_fn(event, option);
      }
    }

    On_Open_Btn_Click(event, menu_div, option_div)
    {
      this.Open(option_div, menu_div);
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
        //open_elem.style.width = this.offsetWidth + "px";
        open_elem.style.width = "100%";
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
      document.addEventListener("scroll", this.Hide);

      if (this.menu_width)
      {
        this.style.width = this.menu_width;
      }

      this.shadowRoot.replaceChildren(this.Get_Styles());
      this.root_div = this.Render_Menu(this.shadowRoot, this.menu_def);
      if (this.show)
      {
        this.Show();
      }
    }

    Get_Styles()
    {
      let elem;
      const def_style = `
        :host
        {
          box-shadow: 3px 3px 5px 0px #0006;
          background-color: #ddd;
          display: none;
          position: fixed;
          z-index: 1;
        }
        .menu 
        {
          display: inline-flex;
          flex-direction: column;
          transition: width 0.25s;
          overflow: hidden;
          padding: 5px 0px;
        }
        .menu_title
        {
          border: none;
          padding: 5px 10px 5px 10px;
          text-align: left;
          cursor: pointer;
          background-color: transparent;
          height: 30px;
          display: flex;
          align-items: center;
          font-weight: bold;
        }
        .menu_title svg
        {
          margin-right: 6px;
        }
        .menu_title:hover
        {
          background-color: #ccc;
        }
        .menu_title_prev
        {
          margin-right: 5px;
          transform: rotateZ(270deg);
          display: inline-block;
          vertical-align: bottom;
          width: 10px;
        }
        .menu_option
        {
          border: none;
          padding: 5px 10px 5px 40px;
          text-align: left;
          cursor: pointer;
          background-color: transparent;
          height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
        }
        .menu_option:hover
        {
          background-color: #ccc;
        }
        .custom_option
        {
          align-items: center;
        }
        #close_img
        {
          xwidth: 20px;
        }
      `;

      if (this.style_src)
      {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = this.style_src;
        elem = link;
      }
      else
      {
        const style = document.createElement("style");
        style.innerHTML = def_style;
        elem = style;
      }

      return elem;
    }

    Render_Menu(parent, menu, is_closed, parent_div)
    {
      let menu_div;

      if (menu)
      {
        menu_div = document.createElement("div");
        parent.append(menu_div);
        menu_div.style.width = "0px";
        if (menu.id) menu_div.id = menu.id;
        menu_div.classList.add(menu.class_name);
        menu_div.append(this.Render_Menu_Title(menu.title, menu_div, parent_div));
        menu_div.append(...this.Render_Menu_Options(parent, menu.options, menu_div));

        menu.elem = menu_div;
      }

      return menu_div;
    }

    Render_Menu_Title(menu_title, menu_div, parent_div)
    {
      const close_btn = document.createElement("button");
      close_btn.style.whiteSpace = "nowrap";
      if (parent_div)
      {
        const arrow_back =
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>`;
        close_btn.innerHTML = arrow_back + "<span>" + menu_title + "</span>";
        close_btn.addEventListener("click", event => this.On_Open_Btn_Click(event, menu_div, parent_div));
      }
      else
      {
        const close =
          `<svg id="close_img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>`;
        close_btn.innerHTML = close + "<span>" + menu_title + "</span>";
        close_btn.addEventListener("click", this.Hide);
      }
      close_btn.classList.add("menu_title");

      return close_btn;
    }

    Render_Menu_Options(parent, options, menu_div)
    {
      return options.map(option => this.Render_Menu_Option(parent, option, menu_div));
    }

    Render_Menu_Option(parent, option, menu_div)
    {
      let option_btn;

      if (option.options)
      {
        const arrow_forward = 
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
          </svg>`;
        option_btn = document.createElement("button");
        option_btn.style.whiteSpace = "nowrap";
        option_btn.innerHTML = "<span>" + option.title + "</span>" + arrow_forward;
        const option_div = this.Render_Menu(parent, option, true, menu_div);
        option_btn.addEventListener("click", event => this.On_Open_Btn_Click(event, menu_div, option_div));
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

      return option_btn;
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

      //this.Confine();
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
      if (this_rect.bottom + padding > doc_rect.height)
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