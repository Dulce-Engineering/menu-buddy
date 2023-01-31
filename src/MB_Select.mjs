import Utils from "./Utils.js";

class MB_Select extends HTMLElement
{
  static tname = "mb-select";

  constructor() 
  {
    super();

    Utils.Bind(this, "On_");

    this.path = "";
    this.menu = null;
    this.obj_id = null;
    this.select_open_src = "";
    this.clr_btn_html = "Clear";
  }

  connectedCallback()
  {
    this.Render();
  }

  disconnectedCallback()
  {
  }

  set value(id)
  {
    this.obj_id = id;
    this.Render_Value(id);
  }

  get value()
  {
    return this.obj_id;
  }

  Get_Open_Id()
  {
    return this.value ? this.Get_Parent(this.value) : null;
  }

  // Overides ===================================================================================

  Get_Label(id)
    {
  }

  Get_Path(id)
  {

  }

  Has_Children(id)
  {
  }

  Get_Children(id)
  {
  }

  Get_Parent(id)
  {
  }

  // Events =====================================================================================

  async On_Click_Back(event, id, menu_elem)
  {
    const parent_menu_elem = await this.Render_Menu(id);
    this.Show(parent_menu_elem);
    this.Hide(menu_elem);
  }

  On_Click_Close(event, menu_elem)
  {
    this.select_btn.disabled = false;
    this.clear_btn.disabled = false;

    this.Hide(menu_elem);
    document.removeEventListener("click", this.On_Click_Dialog);
  }

  async On_Click_Next(event, id, parent_menu_elem)
  {
    const menu_elem = await this.Render_Menu(id);
    this.Show(menu_elem);
    this.Hide(parent_menu_elem);
  }

  async On_Click_Open()
  {
    this.select_btn.disabled = true;
    this.clear_btn.disabled = true;

    const id = await this.Get_Open_Id();
    const menu_elem = await this.Render_Menu(id);
    this.Show(menu_elem);
    document.addEventListener("click", this.On_Click_Dialog);
  }

  On_Click_Option(event, id, menu_elem)
  {
    this.value = id;
    this.On_Click_Close(event, menu_elem);
    this.select_btn.focus();
  }

  On_Click_Clear()
  {
    this.value = null;
  }

  On_Click_Dialog(event)
  {
    const path = event.composedPath();
    const in_menu = path.includes(this.menu);
    if (!in_menu)
  {
      this.On_Click_Close(event, this.menu);
    }
  }

  // Rendering ==================================================================================

  async Render_Value(id)
  {
    let value = null;

    if (id)
    {
      value = await this.Get_Path(id);
    }

    if (Utils.isEmpty(value))
    {
      value = this.getAttribute("def-label") || "";
  }

    this.select_text.innerText = value;
  }

  Render()
  {
    this.replaceChildren();
    this.Render_Select();
    this.Render_Clear();
  }

  Render_Select()
  {
    this.select_text = document.createElement("span");

    this.select_open = document.createElement("img");
    this.select_open.src = this.select_open_src;

    this.select_btn = document.createElement("button");
    this.select_btn.classList.add("mb_sel_btn");
    this.select_btn.addEventListener("click", this.On_Click_Open);
    this.select_btn.append(this.select_text, this.select_open);

    this.append(this.select_btn);
  }

  Render_Clear()
  {
    this.clear_btn = document.createElement("button");
    this.clear_btn.innerHTML = this.clr_btn_html;
    this.clear_btn.classList.add("mb_clr_btn");
    this.clear_btn.addEventListener("click", this.On_Click_Clear);
    this.append(this.clear_btn);
  }

  async Render_Menu(id)
  {
    const menu_elem = document.createElement("div");
    menu_elem.classList.add("mb_menu");
    menu_elem.option_id = id;
    menu_elem.addEventListener("click", this.On_Click_Dialog);

    const title_elem = await this.Render_Title(id, menu_elem);
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

  async Render_Title(id, menu_elem)
  {
    const elem = document.createElement("div");
    elem.innerText = await this.Get_Label(id) || this.getAttribute("root-title") || "Items";
    elem.classList.add("mb_menu_title");

    if (!id)
    {
      const close_elem = document.createElement("button");
      close_elem.classList.add("mb_close_btn");
      close_elem.addEventListener
        ("click", e => this.On_Click_Close(e, menu_elem));
      elem.prepend(close_elem);
    }
    else
    {
      const parent_id = await this.Get_Parent(id);
      const back_elem = document.createElement("button");
      back_elem.classList.add("mb_back_btn");
      back_elem.addEventListener
        ("click", e => this.On_Click_Back(e, parent_id, menu_elem));
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

  Set_Show_Styles(elem)
  {
    elem.classList.add("mb_menu_show");
    elem.classList.remove("mb_menu_hide");
  }

  Show(elem)
  {
    if (elem)
    {
      this.menu = elem;
      this.append(elem);
      requestAnimationFrame(() => this.Set_Show_Styles(elem));
    }
  }

  Set_Hide_Styles(elem)
  {
      elem.classList.add("mb_menu_hide");
      elem.classList.remove("mb_menu_show");
    }

  Hide(elem)
  {
    if (elem)
    {
      this.menu = null;
      this.Set_Hide_Styles(elem);
      elem.addEventListener("transitionend", () => this.Remove(elem));
  }
}

  Remove(elem)
{
    elem.remove();
}
}

Utils.Register_Element(MB_Select);

export default MB_Select;