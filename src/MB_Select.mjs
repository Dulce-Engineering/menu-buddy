class MB_Select extends HTMLElement
{
  static tname = "mb-select";

  constructor() 
  {
    super();

    this.On_Click_Back = this.On_Click_Back.bind(this);
    this.On_Click_Next = this.On_Click_Next.bind(this);
    this.On_Click_Close = this.On_Click_Close.bind(this);
    this.On_Click_Open = this.On_Click_Open.bind(this);
    this.On_Click_Option = this.On_Click_Option.bind(this);
    this.On_Click_Clear = this.On_Click_Clear.bind(this);

    this.path = "";
    this.menus = [];
    this.obj_id = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  Append_Menu(menu_elem)
  {
    this.append(menu_elem);
    this.menus.push(menu_elem);
    console.log("Menu_Buddy_2.Append_Menu(): this.menus =", this.menus);
  }

  Remove_Menu(menu_elem)
  {
    const idx = this.menus.indexOf(menu_elem);
    this.menus.splice(idx, 1);
    menu_elem.remove();
  }

  Clear_Menus()
  {
    for (const menu of this.menus)
    {
      menu.remove();
    }
    this.menus.length = 0;
  }

  Close()
  {
    this.Clear_Menus();

    this.select_btn.disabled = false;
    this.clear_btn.disabled = false;
  }

  async Get_Path()
  {
    let res = "";

    for (const menu of this.menus)
    {
      const label = await this.Get_Label(menu.option_id);
      res = Append_Str(res, label, " / ");
    }

    return res;
  }

  set value(id)
  {
    this.Update_Select_Text(id);
  }

  get value()
  {
    return this.obj_id;
  }

  // Overides ===================================================================================

  Get_Label(id)
  {
  }

  Has_Children(id)
  {
  }

  Get_Children(id)
  {
  }

  // Events =====================================================================================

  On_Click_Back(event, menu_elem, parent_menu_elem)
  {
    event.preventDefault();
    menu_elem.addEventListener("transitionend", () => this.Remove_Menu(menu_elem));
    this.Hide(menu_elem);

    this.Show(parent_menu_elem);
  }

  On_Click_Close(event, menu_elem)
  {
    event.preventDefault();
    menu_elem.addEventListener("transitionend", () => this.Close());
    this.Hide(menu_elem);
  }

  async On_Click_Next(event, id, parent_menu_elem)
  {
    event.preventDefault();

    const menu_elem = await this.Render_Menu(id, parent_menu_elem);
    this.Append_Menu(menu_elem);
    requestAnimationFrame(() => this.Show(menu_elem));

    this.Hide(parent_menu_elem);
  }

  async On_Click_Open()
  {
    event.preventDefault();
    this.select_btn.disabled = true;
    this.clear_btn.disabled = true;

    const menu_elem = await this.Render_Menu(null);
    this.Append_Menu(menu_elem);
    requestAnimationFrame(() => this.Show(menu_elem));
  }

  async On_Click_Option(event, id, menu_elem)
  {
    event.preventDefault();
    this.Update_Select_Text(id);

    menu_elem.addEventListener("transitionend", () => this.Close());
    this.Hide(menu_elem);
  }

  On_Click_Clear()
  {
    event.preventDefault();
    this.Update_Select_Text(null);
  }

  // Rendering ==================================================================================

  async Update_Select_Text(id)
  {
    let label = this.getAttribute("def-label") || "None";

    if (id)
    {
      this.obj_id = id;
      label = await this.Get_Label(id);
      const path = await this.Get_Path();
      label = Append_Str(path, label, " / ");
    }
    else
    {
      this.obj_id = null;
  }

    this.select_btn.innerText = label;
  }

  Render()
  {
    this.select_btn = this.Render_Select();
    this.select_btn.addEventListener("click", this.On_Click_Open);
    this.append(this.select_btn);
    this.Update_Select_Text(null);

    this.clear_btn = this.Render_Clear();
    this.clear_btn.addEventListener("click", this.On_Click_Clear);
    this.append(this.clear_btn);
  }

  Render_Select()
  {
    const elem = document.createElement("button");
    elem.classList.add("mb_sel_btn");

    return elem;
  }

  Render_Clear()
  {
    const elem = document.createElement("button");
    elem.classList.add("mb_clr_btn");

    return elem;
  }

  async Render_Menu(id, parent_menu_elem)
  {
    const menu_elem = document.createElement("div");
    menu_elem.classList.add("mb_menu");
    menu_elem.option_id = id;

    const title_elem = await this.Render_Title(id, parent_menu_elem, menu_elem);
    menu_elem.append(title_elem);

    if (await this.Has_Children(id))
    {
      const child_ids = await this.Get_Children(id);
      const child_elems_p = 
        child_ids.map(id => this.Render_Option(id, menu_elem));
      const child_elems = await Promise.all(child_elems_p);
      menu_elem.append(...child_elems);
    }

    return menu_elem;
  }

  async Render_Title(id, parent_menu_elem, menu_elem)
  {
    const elem = document.createElement("div");
    elem.innerText = await this.Get_Label(id) || this.getAttribute("root-title") || "Items";
    elem.classList.add("mb_menu_title");

    if (!parent_menu_elem)
    {
      const close_elem = document.createElement("button");
      close_elem.classList.add("mb_close_btn");
      close_elem.addEventListener
        ("click", e => this.On_Click_Close(e, menu_elem));
      elem.prepend(close_elem);
    }
    else
    {
      const back_elem = document.createElement("button");
      back_elem.classList.add("mb_back_btn");
      back_elem.addEventListener
        ("click", e => this.On_Click_Back(e, menu_elem, parent_menu_elem));
      elem.prepend(back_elem);
    }

    return elem;
  }

  async Render_Option(id, parent_menu_elem)
  {
    const option_elem = document.createElement("div");
    option_elem.classList.add("mb_menu_option");

    const select_elem = document.createElement("button");
    select_elem.classList.add("mb_option_btn");
    select_elem.innerText = await this.Get_Label(id);
    select_elem.addEventListener("click", e => this.On_Click_Option(e, id, parent_menu_elem));
    option_elem.append(select_elem);

    if (await this.Has_Children(id))
    {
      const next_elem = document.createElement("button");
      next_elem.classList.add("mb_next_btn");
      next_elem.addEventListener
        ("click", e => this.On_Click_Next(e, id, parent_menu_elem));
      option_elem.append(next_elem);
    }

    return option_elem;
  }

  Show(elem)
  {
    elem.classList.add("mb_menu_show");
    elem.classList.remove("mb_menu_hide");
  }

  Hide(elem)
  {
    if (elem)
    {
      elem.classList.add("mb_menu_hide");
      elem.classList.remove("mb_menu_show");
    }
  }
}

function Append_Str(a, b, sep)
{
  return a && b ? a + sep + b : a || b;
}

export default MB_Select;