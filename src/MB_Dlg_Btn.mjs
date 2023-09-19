import Utils from "./Utils.js";

class MB_Dlg_Btn extends HTMLElement
{
  static tname = "mb-dlg-btn";

  constructor() 
  {
    super();

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  disconnectedCallback()
  {
  }

  Init(options)
  {
    this.mb_menu.Get_Label = options.Get_Label;
    this.mb_menu.Has_Children = options.Has_Children;
    this.mb_menu.Get_Children = options.Get_Children;
    this.mb_menu.Render();
  }

  get value()
  {
    return this.mb_menu?.value;
  }

  // Events =====================================================================================

  On_Click_Menu()
  {
    this.menu_dlg.showModal();
  }

  On_Close_Menu()
  {
    this.menu_dlg.close();
  }

  On_Click_Option()
  {
    this.dispatchEvent(new Event("clickoption"));
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
    const html = `
      <button cid="menu_btn"><span>Menu</span></button>
      <dialog cid="menu_dlg">
        <mb-hr-menu cid="mb_menu" close-btn></mb-hr-menu>
      </dialog>
    `;

    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.menu_btn.addEventListener("click", this.On_Click_Menu);
    this.mb_menu.addEventListener("close", this.On_Close_Menu);
    this.mb_menu.addEventListener("clickoption", this.On_Click_Option);
  }
}

Utils.Register_Element(MB_Dlg_Btn);

export default MB_Dlg_Btn;