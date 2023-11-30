import Utils from "./Utils.js";
import Mb_Hr_Menu from "./MB_Hr_Menu.mjs";

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

  set options_flat(array)
  {
    this.options =
    {
      Get_Label: o => o?.title,
      Has_Children: o => o == null ? true : false,
      Get_Children: o => o == null ? array : null,
      Is_Visible: o => o == null || o.visible == null || o.visible == undefined || o.visible == true
    };
    this.Set_Menu_Options();
  }

  get value()
  {
    return this.mb_menu?.value;
  }

  Set_Menu_Options()
  {
    if (this.options && this.mb_menu)
    {
      this.mb_menu.Get_Label = this.options.Get_Label;
      this.mb_menu.Has_Children = this.options.Has_Children;
      this.mb_menu.Get_Children = this.options.Get_Children;
      this.mb_menu.Is_Visible = this.options.Is_Visible;
    }
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
    this.Set_Menu_Options();
  }
}

Utils.Register_Element(MB_Dlg_Btn);

export default MB_Dlg_Btn;