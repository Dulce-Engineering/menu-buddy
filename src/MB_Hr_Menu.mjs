import Utils from "./Utils.js";

class MB_Hr_Menu extends HTMLElement
{
  static tname = "mb-hr-menu";

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

  Is_Visible(id)
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
    //this.Hide(menu_elem);
    this.dispatchEvent(new Event("close"));
  }

  async On_Click_Next(event, id, parent_menu_elem)
  {
    const menu_elem = await this.Render_Menu(id);
    this.Show(menu_elem);
    this.Hide(parent_menu_elem);
  }

  On_Click_Option(event, id, menu_elem)
  {
    this.value = id;
    if (this.hasAttribute("close-btn"))
    {
      this.On_Click_Close(event, menu_elem);
    }
    this.dispatchEvent(new Event("clickoption"));
    if (id.click)
    {
      id.click(this);
    }
  }

  On_Click_Clear()
  {
    this.value = null;
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
  }

  Render()
  {
    this.replaceChildren();
    this.Render_Update();
  }

  async Render_Update()
  {
    const id = await this.Get_Open_Id();
    const menu_elem = await this.Render_Menu(id);
    this.Show(menu_elem);
  }

  async Render_Menu(id)
  {
    const menu_elem = document.createElement("div");
    menu_elem.classList.add("mb_menu");
    menu_elem.option_id = id;

    const title_elem = await this.Render_Title(id, menu_elem);
    menu_elem.append(title_elem);

    if (await this.Has_Children(id))
    {
      const child_ids = await this.Get_Children(id);
      const visible_child_ids = child_ids.filter(id => this.Is_Visible(id));

      const child_elems_p = 
        visible_child_ids.map(id => this.Render_Option(id, menu_elem));
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

    if (!id && this.hasAttribute("close-btn"))
    {
      elem.addEventListener("click", e => this.On_Click_Close(e, menu_elem));
      elem.classList.add("mb_close_btn");
    }
    else if (id)
    {
      const parent_id = await this.Get_Parent(id);
      elem.addEventListener("click", e => this.On_Click_Back(e, parent_id, menu_elem));
      elem.classList.add("mb_back_btn");
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
      next_elem.addEventListener("click", e => this.On_Click_Next(e, id, parent_menu_elem));
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

Utils.Register_Element(MB_Hr_Menu);

export default MB_Hr_Menu;