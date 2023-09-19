import Utils from "./Utils.js";

class Menu_Buddy extends HTMLElement
  {
    static tname = "menu-buddy";

    constructor() 
    {
      super();
      this.can_close = true;
      this.arrow_back_svg =
        `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>`;
      this.close_svg =
        `<svg id="close_img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>`;
      this.arrow_forward_svg = 
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
          </svg>`;

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

  static observedAttributes = ["can-close"];
    attributeChangedCallback(attrName, oldValue, newValue)
    {
    if (attrName == "can-close")
      {
        this.canClose = newValue;
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

    set canClose(value)
    {
      this.can_close = Menu_Buddy.To_Bool(value);
    }

    static To_Bool(value)
    {
      let res = false;

      if (value)
      {
        if (typeof value == "string")
        {
          const valStr = value.trim().toLowerCase();
          if (valStr == "true" || valStr == "yes" || valStr == "t")
          {
            res = true;
          }
        }
        else if (typeof value == "boolean")
        {
          res = value;
        }
        else if (typeof value == "number" && value != 0)
        {
          res = true;
        }
      }
  
      return res;
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
        this.Close_Elem(close_elem);
      }
      if (open_elem)
      {
        this.Open_Elem(open_elem);
      }
    }

    Close_All()
    {
      for (const elem of this.shadowRoot.children)
      {
        if (elem.tagName != "style")
          this.Close_Elem(elem);
      }
    }

    Close_Elem(elem)
    {
      elem.classList.remove("menu_open");
    }

    Open_Elem(elem)
    {
      elem.classList.add("menu_open");
    }

    Render()
    {
      document.addEventListener("scroll", this.Hide);

      if (this.menu_width)
      {
        this.style.width = this.menu_width;
      }

    const styles = this.Get_Styles();
    this.shadowRoot.replaceChildren(styles);
      this.root_div = this.Render_Menu(this.shadowRoot, this.menu_def);
    if (this.hasAttribute("show"))
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
          display: inline-block;
          vertical-align: top;
          overflow: hidden;
          transition: width 0.25s;
          box-sizing: border-box;
          background-color: #ddd;
          padding: 0;
          margin: 0;
          border: none;
          width: 0;
        }

        .menu_open
        {
          width: 200px;
        }
        .menu_title
        {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0;
          border: none;
          margin: 0;
          background-color: transparent;
          cursor: pointer;
          height: 30px;
          font-weight: bold;
          white-space: nowrap;
        }
        .menu_title span
        {
          line-height: 30px;
        }
        .menu_title svg
        {
          vertical-align: middle;
          margin: 0px 5px 0px 5px;
        }
        .menu_title:hover
        {
          background-color: #ccc;
        }

        .menu_option
        {
          display: flex;
          width: 100%;
          text-align: left;
          padding: 0;
          border: none;
          margin: 0;
          background-color: transparent;
          cursor: pointer;
          height: 30px;
          white-space: nowrap;
          justify-content: space-between;
          align-items: center;  
        }
        .menu_option span
        {
          padding-left: 30px;
          line-height: 30px;
        }
        .menu_option svg
        {
          vertical-align: middle;
          margin: 0px 10px 0px 5px;
        }
        .menu_option:hover
        {
          background-color: #ccc;
        }
        .title_only
        {
          padding-right: 20px;
        }
      `;

    if (this.hasAttribute("style-src"))
      {
        const link = document.createElement("link");
        link.rel = "stylesheet";
      link.href = this.getAttribute("style-src");
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
      let svg = "";
      const close_btn = document.createElement("div");

      if (parent_div)
      {
        svg = this.arrow_back_svg;
        close_btn.addEventListener
          ("click", event => this.On_Open_Btn_Click(event, menu_div, parent_div));
      }
      else if (this.can_close)
      {
        svg = this.close_svg;
        close_btn.addEventListener("click", this.Hide);  
      }

      close_btn.innerHTML = svg + "<span class='title_only'>" + menu_title + "</span>";
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
        option_btn = document.createElement("div");
        option_btn.innerHTML = "<span>" + option.title + "</span>" + this.arrow_forward_svg;
        const option_div = this.Render_Menu(parent, option, true, menu_div);
        option_btn.addEventListener
          ("click", event => this.On_Open_Btn_Click(event, menu_div, option_div));
      }
      else if (typeof(option.title) == "object")
      {
        option_btn = option.title;
      }
      else
      {
        option_btn = document.createElement("div");
        option_btn.innerHTML = "<span class='title_only'>" + option.title + "</span>";
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
        //x = src_rect.left;
        //y = src_rect.top - this_rect.height;
        //this.style.left = x + "px";
        //this.style.top = y + "px";
        }
        if (pos_str == "bottom")
        {
        //x = src_rect.left;
        //y = src_rect.bottom;
        //this.style.left = x + "px";
        //this.style.top = y + "px";
        }
        if (pos_str == "left")
        {
        //x = src_rect.left - this_rect.width;
        //y = src_rect.top;
        this.style.right = src_rect.width + "px";
        //this.style.top = src_rect.top + "px";
        }
        if (pos_str == "right")
        {
        //x = src_rect.right;
        //y = src_rect.top;
        //this.style.left = x + "px";
        //this.style.top = y + "px";
        }
      }

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

  class Option_Link
  {
    constructor(title, url)
    {
      Utils.Bind(this, "On_");
      
      this.title = title;
      this.url = url;
      this.on_click_fn = this.On_Click;
    }

    On_Click()
    {
      //window.open(this.url, "_blank");
      window.open(this.url, "_self");
    }
  }
  Menu_Buddy.Option_Link = Option_Link;

  Utils.Register_Element(Menu_Buddy);

  export default Menu_Buddy;