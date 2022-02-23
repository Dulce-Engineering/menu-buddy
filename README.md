# Menu Buddy
JavaScript Web Component for displaying iPod-like sliding menus. No dependencies. This form of sliding menu allows for infinitely nested menu structures that can still be displayed within a confined rendering area. Great for situations where you want to provide a minimalist UI that still allows for access to many functionality options. Menu Buddy can be used to render always-on navigation bar menus, drop-down menus, or customised as needed.

![Menu Buddy Example](https://github.com/Dulce-Engineering/menu-buddy/blob/main/images/menu-buddy.png?raw=true)

## Attributes
- **style-src**  
Optional url string indicating which styles file to use.
- **show**  
Optional string indicating if menu should be visible. Any value acceptable to make menu visible.

## Fields
- **menu**  
Configuration object indicating menu structure. See "Configuration" section for more details.
- **style_src**  
Optional url string indicating which styles file to use.
- **show**  
Optional string indicating if menu should be visible. Any value acceptable to make menu visible.

## Methods
- **Open(open_elem, close_elem)**  
Can be used to open a specific sub-menu whilst closing another.
- **Close_All()**  
Can be used to close all sub-menus.
- **Toggle(src_elem, pos_str)**  
Can be used to show or hide the entire menu and, optionally, indicate the rendering position relative to another element. 
- **Hide()**  
Can be used to hide the entire menu.
- **Show(src_elem, pos_str)**  
Can be used to show the entire menu and, optionally, indicate the rendering position relative to another element. 

## Events
- **clickoption**  
Can be used to trigger a function when the user selects a menu option. The selected option can be retrieved from the event.detail property.

## Configuration
```
menu = 
{
  title: Optional string for display,
  class_name: Optional CSS class name to apply to main menu element,
  options: array of, possibly nested, menu objects indicating sub-menus options
  [
    menu,
    menu,
    ...
  ]
}
```

# Menu Buddy Button

## Attributes
- **btn-style-src**  
Optional url string indicating which styles file to use for the button.
- **menu-style-src**  
Optional url string indicating which styles file to use for the menus.
- **show-pos**  
Optional string indicating position of menu relative to button. Can be "top", "bottom", "left", or "right".
- **fixed-width**
Optional string indicating the width that should be maintained as a user moves through menu options.

## Fields
- **menu**  
Configuration object indicating menu structure. See Menu Buddy "Configuration" section for more details.
- **menu_style_src**  
Optional url string indicating which styles file to use
- **show_pos**  
Optional string indicating position of menu relative to button. Can be "top", "bottom", "left", or "right".
- **menu_buddy**  
Accessible instance of Menu Buddy.
- **fixed_width**
Optional string indicating the width that should be maintained as a user moves through menu options.

## Events
- **clickoption**  
Can be used to trigger a function when the user selects a menu option. The selected option can be retrieved from the event.detail property.

## Sample code
The "index.html" file includes three sample renderings of menus as a left sidebar menu, a programmatically managed menu, and an automated dropwdown via Menu Buddy Button.