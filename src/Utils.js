class Utils
{
  static MILLIS_SECOND = 1000;
  static MILLIS_MINUTE = Utils.MILLIS_SECOND * 60;
  static MILLIS_HOUR = Utils.MILLIS_MINUTE * 60;
  static MILLIS_DAY = Utils.MILLIS_HOUR * 24;
  static MILLIS_WEEK = Utils.MILLIS_DAY * 7;
  static MILLIS_MONTH = Utils.MILLIS_WEEK * 4;
  static MILLIS_YEAR = Utils.MILLIS_MONTH * 12;

  static Abbreviate(str)
  {
    const MAX_LENGTH = 200;
    let res;

    if (!Utils.isEmpty(str))
    {
      if (str.length > MAX_LENGTH)
      {
        res = str.substring(0, MAX_LENGTH) + "...";
      }
      else
      {
        res = str;
      }
    }

    return res;
  }

  static addDays(date, days)
  {
    const res = new Date(date);
    res.setDate(res.getDate() + days);

    return res;
  }

  static addMonths(date, months)
  {
    const res = new Date(date);
    res.setMonth(res.getMonth() + months);

    return res;
  }

  static Add_Param(url, param_name, param_Value)
  {
    if (param_Value)
    {
      let sep = "&";

      if (!url.includes("?"))
      {
        sep = "?";
      }
      url = Utils.appendStr(url, param_name + "=" + param_Value, sep);
    }

    return url;
  }

  static Add_Stylesheet(elem, attrib_name = "style-src")
  {
    if (elem.hasAttribute(attrib_name))
    {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = elem.getAttribute(attrib_name);
      elem.shadowRoot.append(link);
    }
  }
  
  static appendParam(params, paramName, paramValue, defValue)
  {
    if (!Utils.isEmpty(paramValue))
    {
      params = Utils.appendStr(params, paramName + "=" + paramValue, "&");
    }
    else if (!Utils.isEmpty(defValue))
    {
      params = Utils.appendStr(params, paramName + "=" + defValue, "&");
    }

    return params;
  }

  static appendStr(a, b, sep)
  {
    let res = null;

    if (sep == null || sep == undefined)
    {
      sep = "";
    }
    if (a && b && a.length > 0 && b.length > 0)
    {
      res = a + sep + b;
    } else if (a && !b && a.length > 0)
    {
      res = a;
    } else if (!a && b && b.length > 0)
    {
      res = b;
    }

    return res;
  }

  static Back_And_Refresh()
  {
    document.referrer ? window.location = document.referrer : history.back();
  }

  static Bind(obj, fn_prefix)
  {
    const members = Utils.getMethods(obj);
    for (const member of members)
    {
      if (typeof obj[member] == "function" && member.startsWith(fn_prefix))
      {
        obj[member] = obj[member].bind(obj);
      }
    }
  }

  static Calc_Arrival_Time(x1, y1, t1, x2, y2, v)
  {
    const d = Utils.Calc_Distance(x1, y1, x2, y2);
    const t2 = t1 + d/v;

    return t2;
  }

  static Calc_Direction(vx, vy)
  {
    let res = 0;

    const m1 = 0.41421356237;
    const m2 = 2.41421356237;
    const m3 = -2.41421356237;
    const m4 = -0.41421356237;

    const m1y = m1 * vx;
    const m2y = m2 * vx;
    const m3y = m3 * vx;
    const m4y = m4 * vx;

    if (vy < m2y && vy < m3y)
    {
      res = 0
    }
    else if (vy < m1y && vy > m2y)
    {
      res = 1
    }
    else if (vy < m4y && vy > m1y)
    {
      res = 2
    }
    else if (vy < m3y && vy > m4y)
    {
      res = 3
    }
    else if (vy > m2y && vy > m3y)
    {
      res = 4
    }
    else if (vy > m1y && vy < m2y)
    {
      res = 5
    }
    else if (vy > m4y && vy < m1y)
    {
      res = 6
    }
    else if (vy > m3y && vy < m4y)
    {
      res = 7
    }

    return res;
  }

  static Calc_Distance(x1, y1, x2, y2)
  {
    return Math.hypot(x2-x1, y2-y1);
  }

  static Calc_Path(x1, y1, t1, x2, y2, t2)
  {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dt = t2 - t1;

    let mx = 0, my = 0;
    if (dt!=0)
    {
      mx = dx / dt;
      my = dy / dt;
    }

    const bx = x1 - mx*t1;
    const by = y1 - my*t1;

    const dir = Utils.Calc_Direction(mx, my);
    const path = 
    {
      mx, bx, my, by, dir,
      x1, y1, t1,
      x2, y2, t2
    };

    return path
  }

  static Calc_Position(path, t)
  {
    let x = path.x1;
    let y = path.y1;

    if (t > path.t2)
    {
      x = path.x2;
      y = path.y2;
    }
    else if (t > path.t1)
    {
      x = path.mx * t + path.bx;
      y = path.my * t + path.by;
    }

    return {x, y};
  }

  static async Calc_Values(objs, obj_field, calc_fn)
  {
    if (objs && objs.length >0)
    {
      for (const obj of objs)
      {
        obj[obj_field] = await calc_fn(obj);
      }
    }
  }

  static Clone_Template(template_elem)
  {
    const clone = template_elem.content.cloneNode(true);
    Utils.Set_Id_Shortcuts(clone, clone);
    return clone;
  }

  static Connect_Store(elem, On_Store_Connected, event = "connected")
  {
    let store_elem = null;

    const store_id = elem.getAttribute("store-id");
    if (!Utils.isEmpty(store_id))
    {
      store_elem = document.getElementById(store_id);
      if (store_elem)
      {
        store_elem.addEventListener(event, On_Store_Connected);
      }
    }

    return store_elem;
  }

  static Disable(id)
  {
    const elem = document.getElementById(id);
    if (elem)
    {
      elem.disabled = true;
    }
  }
  
  static async fetch(url, method, xApiKey, body)
  {
    let res = null;
    const options =
    {
      method,
      headers: 
      {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey
      }
    };

    if (body)
    {
      options.body = body;
    }
    
    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      res = await httpRes.text();
    }

    return res;
  }
  
  static fetchGetJson(url, xApiKey)
  {
    return Utils.fetchJson(url, "GET", xApiKey);
  }
    
  static async fetchGetXml(url)
  {
    let res = null;
    const options = Utils.setOptions("GET", null, 'application/soap+xml');
    
    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      const textRes = await httpRes.text();
      if (httpRes.ok)
      {
        res = Utils.xmlToJson(textRes);
      }
      else
      {
        console.error("Utils.fetchGetXml(): HTTP status, data -", httpRes.status, textRes);
      }
    }

    return res;
  }

  static async fetchJson(url, method, xApiKey, body, auth)
  {
    let res = null;
    const options =
    {
      method,
      headers:
      {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey
      }
    };

    if (body)
    {
      options.body = body;
    }
    if (auth)
    {
      options.headers.Authorization = auth;
    }
    
    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      const textRes = await httpRes.text();
      res = JSON.parse(textRes);
    }

    return res;
  }
  
  static fetchPostJson(url, xApiKey, bodyObj, auth)
  {
    let body;

    if (bodyObj)
    {
      body = JSON.stringify(bodyObj);
    }

    return Utils.fetchJson(url, "POST", xApiKey, body, auth);
  }

  static Focus_Input()
  {
    var input = document.getElementsByTagName('INPUT');
    for (var i = 0, n = input.length; i < n; i = i + 1)
    {
      if (input[i].value.length !== "")
      {
        input[i].focus();
      }
    }
  }

  static Get_Attr_Def(elem, name, def)
  {
    const attr_val = elem.getAttribute(name);
    return Utils.hasValue(attr_val) ? attr_val : def;
  }

  static getDayOfWeekName(date)
  {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day = date.getDay();
    const dayOfWeek = dayNames[day];

    return dayOfWeek;
  }

  static getCurrentDate()
  {
    const now = new Date();
    const res = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return res;
  }

  static getFromLocalStorge(key, defaultValue)
  {
    return Utils.Get_From_Storage(localStorage, key, defaultValue);
  }

  static getFromLocalStorgeInt(key, defaultValue)
  {
    return parseInt(Utils.getFromLocalStorge(key, defaultValue));
  }

  static getFromLocalStorgeJson(key, defaultValue)
  {
    return Utils.Get_From_Storage_JSON(localStorage, key, defaultValue);
  }

  static Get_From_Storage(storage, key, defaultValue)
  {
    let res = defaultValue;

    const storageStr = storage.getItem(key);
    if (!Utils.isEmpty(storageStr))
    {
      res = storageStr;
    }

    return res;
  }

  static Get_From_Storage_JSON(storage, key, defaultValue)
  {
    let res = null;

    const json_str = Utils.Get_From_Storage(storage, key, defaultValue);
    if (!Utils.isEmpty(json_str))
  {
      res = JSON.parse(json_str);
    }

    return res;
  }

  static getMethods(obj)
  {
    let properties = new Set();
    let currentObj = obj;
    do 
    {
      Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
    } 
    while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()].filter(item => typeof obj[item] === 'function');
  }

  static Get_Param(param_name)
  {
    const urlParams = new URLSearchParams(window.location.search);
    const res = urlParams.get(param_name);
    return res;
  }

  static async Get_Storage_Download_URL(fb_strg, id)
  {
    const ref = fb_strg.ref().child(id);
    let url = null;

    try
    {
      url = await ref.getDownloadURL();
    }
    catch (error)
    {
      console.error(error);
    }

    return url;
  }

  static Get_Store_Id(user_uid)
    {
    let store_id = null;

    if (user_uid)
    {
      const key = "store_id." + user_uid;
      store_id = localStorage.getItem(key);
      }

    return store_id;
  }

  static Handle_Errors(api_class)
  {
    if (api_class?.last_rpc?.error)
    {
      alert(api_class.last_rpc.error.code + ": " + api_class.last_rpc.error.message);
    }
    else
    {
      alert("There was a problem.");
    }
  }
  
  static hasValue(data)
  {
    let res = true;
    
    if (data == undefined || data == null)
    {
      res = false;
    }

    return res;
  }

  static Hide(id, parent_elem)
  {
    if (!parent_elem)
    {
      parent_elem = document;
    }

    const elem = parent_elem.querySelector("#" + id);
    if (elem)
    {
      elem.style.display = "none";
    }
  }

  static Hide_Element(elem)
  {
    if (elem)
    {
      const def_display = getComputedStyle(elem).getPropertyValue("display");
      if (def_display && def_display != "none")
      {
        elem.style.setProperty("--def-display", def_display);
      }
      
      elem.style.display = "none";
    }
  }

  static async Import_API(config, on_pre_fetch_fn, on_fetch_fn, token, on_error_fn)
    {
    const api = await import(config.api_client_url);
    for (const comp_class_name in api.default)
    {
      const comp_class = api.default[comp_class_name];
      comp_class.server_host = config.api_server_host;
      comp_class.On_Fetch = on_fetch_fn;
      comp_class.On_Pre_Fetch = on_pre_fetch_fn;
      comp_class.headers = !Utils.isEmpty(token) ? {authorization: "Firebase " + token} : null;
      comp_class.On_Error = on_error_fn;
      window[comp_class_name] = comp_class;
    }
    
    return api.default;
  }

  static isEmpty(items)
  {
    let res = false;
    const typeOfItems = typeof items;

    if (items == null || items == undefined)
    {
      res = true;
    }
    else if (Array.isArray(items))
    {
      if (items.length == 0)
      {
        res = true;
      }
    }
    else if (typeOfItems == "string")
    {
      const str = items.trim();
      if (str.length == 0 || str == "")
      {
        res = true;
      }
    }
    else if (typeOfItems == "object")
    {
      if (items?.constructor?.name == "NodeList")
      {
        res = length > 0;
      }
      else
      {
      res = Utils.isEmptyObj(items);
    }
    }
    else if (items.length == 0)
    {
      res = true;
    }

    return res;
  }

  static isEmptyObj(obj)
  {
    if (!obj) return true;

    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static Is_Line_Circle_Collision(x1, y1, x2, y2, cx, cy, r)
  {
    // is either end INSIDE the circle?
    // if so, return true immediately
    const inside1 = Utils.Is_Point_Circle_Collision(x1,y1, cx,cy,r);
    const inside2 = Utils.Is_Point_Circle_Collision(x2,y2, cx,cy,r);
    if (inside1 || inside2) return true;

    // get length of the line
    const len = Utils.Calc_Distance(x1, y1, x2, y2);

    // get dot product of the line and circle
    const dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

    // find the closest point on the line
    const closestX = x1 + (dot * (x2-x1));
    const closestY = y1 + (dot * (y2-y1));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    const onSegment = Utils.Is_Line_Point_Collision(x1,y1,x2,y2, closestX,closestY);
    if (!onSegment) return false;

    // get distance to closest point
    const distance = Utils.Calc_Distance(closestX, closestY, cx, cy);
    return (distance <= r);
  }

  static Is_Line_Point_Collision(x1, y1, x2, y2, px, py) 
  {
    const d1 = Utils.Calc_Distance(px,py, x1,y1);
    const d2 = Utils.Calc_Distance(px,py, x2,y2);
    const dp = Utils.Calc_Distance(x1,y1, x2,y2);
    const buffer = 0.1;    // higher # = less accurate
    return (d1+d2 >= dp-buffer && d1+d2 <= dp+buffer);
  }

  static Is_Point_Circle_Collision(px, py, cx, cy, r) 
  {
    const distance = Utils.Calc_Distance(px,py, cx,cy);
    return distance <= r;
  }

  static length(value)
  {
    let res = 0;

    if (value)
    {
      res = value.length;
    }

    return res;
  }

  static Line_Circle_Intersection(x1, y1, x2, y2, cx, cy, r)
  {
    let res;

    x1 = x1-cx;
    y1 = y1-cy;
    x2 = x2-cx;
    y2 = y2-cy;

    const dx = x2-x1;
    const dy = y2-y1;
    const dr = dx*dx+dy*dy;
    const D = x1*y2-x2*y1;
    const i = r*r*dr-D*D;

    if (i>=0)
    {
      const sy = Utils.Sign(dy);
      const si = Math.sqrt(i);
      const ay = Math.abs(dy);

      const col_x1 = ( D*dy+sy*dx*si)/dr;
      const col_y1 = (-D*dx+ay*si)/dr;
      let col_x2 = col_x1;
      let col_y2 = col_y1;
      if (i>0)
      {
        col_x2 = ( D*dy-sy*dx*si)/dr;
        col_y2 = (-D*dx-ay*si)/dr;
      }

      res = 
      [
        {x: col_x1+cx, y: col_y1+cy}, 
        {x: col_x2+cx, y: col_y2+cy}
      ];
    }
    
    return res;
  }

  static nullIfEmpty(items)
  {
    let res = items;

    if (Utils.isEmpty(items))
    {
      res = null;
    }

    return res;
  }
  
  static nullIfEmptyObj(obj)
  {
    let res = null;

    if (obj && Object.keys(obj).length > 0)
    {
      res = obj;
    }

    return res;
  }

  static Path_Circle_Intersection(x1, y1, x2, y2, cx, cy, r)
  {
    let res;

    const has_collision = Utils.Is_Line_Circle_Collision(x1, y1, x2, y2, cx, cy, r);
    if (has_collision)
    {
      const buffer = 1;
      let pts = Utils.Line_Circle_Intersection(x1, y1, x2, y2, cx, cy, r+buffer);
      pts[0].d = Utils.Calc_Distance(x1, y1, pts[0].x, pts[0].y);
      pts[1].d = Utils.Calc_Distance(x1, y1, pts[1].x, pts[1].y);
      pts = pts.sort((p1, p2) => p1.d-p2.d);
      res = {x: pts[0].x, y: pts[0].y};
    }

    return res;
  }

  static Register_Element(elem_class)
  {
    const comp_class = customElements.get(elem_class.tname);
    if (comp_class == undefined)
    {
      customElements.define(elem_class.tname, elem_class);
    }
  }

  static async Render_Wait(container_elem, fn)
  {
    container_elem.classList.add("waiting");
    await fn();
    container_elem.classList.remove("waiting");
  }

  static async Render_Wait_Btn(container_elem, fn, class_name)
  {
    let container_class_name = class_name;
    if (Utils.isEmpty(class_name) || class_name == "debug")
    {
      container_class_name = "waiting_btn";
    }

    container_elem.classList.add(container_class_name);
    if (class_name != "debug")
  {
    await fn();
      container_elem.classList.remove(container_class_name);
    }
  }

  static Set_APIs_Auth(token, apis)
  {
    for (const comp_class_name in apis)
    {
      const comp_class = apis[comp_class_name];
      if (token)
      {
        comp_class.headers = {authorization: "Firebase " + token};
      }
      else
      {
        comp_class.headers = null;
      }
    }
  }

  static Set_Filter(filters, id, value)
  {
    let res = null;

    if (filters)
    {
      filters[id] = value;
      res = filters;
    }
    else
    {
      res = {};
      res[id] = value;
    }

    return res;
  }

  static Set_Id_Shortcuts(src_elem, dest_elem, attr_name = "id")
  {
    const elems = src_elem.querySelectorAll("[" + attr_name + "]");
    for (const elem of elems)
    {
      const id_value = elem.getAttribute(attr_name);
      dest_elem[id_value] = elem;
    }
  }

  static setLocalStorgeJson(key, value)
  {
    const value_str = JSON.stringify(value);
    localStorage.setItem(key, value_str);
  }

  static setOptions(method, xApiKey, contentType, body, auth)
  {
    const options =
    {
      method,
      headers: 
      {
        'Content-Type': contentType,
        'x-api-key': xApiKey
      }
    };

    if (body)
    {
      options.body = body;
    }
    if (auth)
    {
      options.headers.Authorization = auth;
    }

    return options;
  }

  static Set_Store_Id(user_uid, id)
  {
    if (user_uid)
    {
      const key = "store_id." + user_uid;
      localStorage.setItem(key, id);
    }
  }

  static Show(id, parent_elem)
  {
    if (!parent_elem)
    {
      parent_elem = document;
    }

    const elem = parent_elem.querySelector("#" + id);
    Utils.Show_Element(elem);
  }

  static Show_Element(elem)
  {
    if (elem)
    {
      const def_display = getComputedStyle(elem).getPropertyValue("--def-display");
      if (def_display)
      {
        elem.style.display = def_display;
      }
      else
      {
        elem.style.removeProperty("display");
      }
    }
  }

  static Sign(x)
  {
    return x<0 ? -1 : 1;
  }

  static sleep(ms)
  {
    return new Promise((resolve) =>
    {
      setTimeout(resolve, ms);
    });
  }

  static to2DigitStr(number)
  {
    let res;

    if (number < 10)
    {
      res = "0" + number;
    }
    else
    {
      res = "" + number;
    }

    return res;
  }

  static toAlwaysArray(array)
  {
    let res = array;
    if (array == null || array == undefined)
    {
      res = [];
    }

    return res;
  }

  static toArray(str)
  {
    let res = null;

    if (str)
    {
      const strObj = JSON.parse(str);
      if (strObj && Array.isArray(strObj) && strObj.length > 0)
      {
        res = strObj;
      }
    }

    return res;
  }

  static To_AUD(num)
  {
    const fixed = Number.parseFloat(num).toFixed(2);
    return "$" + fixed;
  }

  static toBoolean(val)
  {
    let res = false;

    if (val != null && val != undefined)
    {
      const valType = typeof val;
      if (valType == "string")
      {
        val = val.toLowerCase();
        if (val == "true" || val == "yes" || val == "t")
        {
          res = true;
        }
      }
      else if (valType == "number")
      {
        if (val != 0)
        {
          res = true;
        }
      }
      else
      {
        res = (val);
      }
    }

    return res;
  }

  static toCents(price)
  {
    let newPrice = 0;

    if (price)
    {
      newPrice = price * 100;
    }

    return newPrice;
  }

  static To_Currency(value, currency)
  {
    let res = null;

    if (currency)
    {
      const style = 'currency';
      const formatter = new Intl.NumberFormat('en-US', { style, currency });
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)

      res = formatter.format(value);
    }
    else
    {
      res = Utils.To_AUD(value);
    }

    return res;
  }

  static To_Class_Obj(obj, class_obj)
  {
    if (obj)
    {
      for (const key in obj)
      {
        class_obj[key] = obj[key];
      }
    }
  }

  static toDateOnly(dateStr)
  {
    const values = dateStr.split("-");
    const year = parseInt(values[0]);
    const month = parseInt(values[1]) - 1;
    const day = parseInt(values[2]);
    const date = new Date(year, month, day);

    return date;
  }

  static toDateStr(date)
  {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = year + "-" + Utils.to2DigitStr(month) + "-" + Utils.to2DigitStr(day);

    return dateStr;
  }

  static toDaysDiff(fromDateStr, toDateStr)
  {
    let days;

    if (fromDateStr && toDateStr)
    {
      const fromDate = Utils.toDateOnly(fromDateStr);
      const toDate = Utils.toDateOnly(toDateStr);
      const diffMillis = toDate - fromDate;
      days = diffMillis/1000/60/60/24;
    }

    return days;
  }

  static toDocument(html, src_elems) 
  {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    const template_elems = template.content;

    if (src_elems)
    {
      const slot_elems = template_elems.querySelectorAll("slot"); 
      if (!Utils.isEmpty(slot_elems))
      {
        for (const slot_elem of slot_elems)
        {
          const content_elems = src_elems.querySelectorAll(`[slot='${slot_elem.name}']`);
          if (!Utils.isEmpty(content_elems))
          {
            slot_elem.replaceWith(...content_elems);
          }
        }
      }
    }
  
    return template_elems;
  }

  static Get_Slot_Content(src_elems, slot_name)
  {
    return src_elems.querySelector(`[slot='${slot_name}']`);
  }

  static toDollarsCents(price)
  {
    let newPrice = 0;

    if (price)
    {
      newPrice = price / 100;
    }

    return newPrice;
  }

  static toElement(html) 
  {
    return Utils.toDocument(html).firstChild;
  }

  static toElements(html) 
  {
    return Utils.toDocument(html).childNodes;
  }

  static toEmptyStr(value)
  {
    let res = value;
    
    if (value == null || value == undefined)
    {
      res = "";
    }

    return res;
  }

  static toFloat(value, defaultValue)
  {
    let res = value;

    if (Utils.isEmpty(value))
    {
      res = defaultValue;
    }
    else
    {
      res = parseFloat(value);
    }

    return res;
  }

  static toHours(minutes)
  {
    let res = '';
    if(minutes > 0)
    {
       const h = Math.floor(minutes / 60);
       const m = minutes % 60;
      if(h == 1) res += h + ' hour';
      if(h > 1)  res += h + ' hours';
      if(m == 1) res += ` ${m} minute`;
      if(m > 1)  res += ` ${m} minutes`;
    }

    return res.trim();
  }

  static toInt(value, defaultValue)
  {
    let res = value;

    if (Utils.isEmpty(value))
    {
      res = defaultValue;
    }
    else
    {
      res = parseInt(value);
    }

    return res;
  }

  static toJSONArray(obj)
  {
    let res;

    if (obj)
    {
      res = JSON.stringify(obj);
    }

    return res;
  }

  static toJSONStr(obj)
  {
    let res;

    if (obj)
    {
      res = JSON.stringify(obj);
    }

    return res;
  }

  static To_Local_Date_Str(unix_time)
  {
    return !Utils.isEmpty(unix_time) ? (new Date(unix_time)).toDateString() : null;
  }

  static To_Local_Date_Time_Str(unix_time)
  {
    return !Utils.isEmpty(unix_time) ? (new Date(unix_time)).toLocaleString() : null;
  }

  static toNull(value)
  {
    let res = value;

    if (value == undefined)
    {
      res = null;
    }

    return res;
  }

  static To_Obj(class_obj)
  {
    const obj = {};

    for (const key in class_obj)
    {
      obj[key] = class_obj[key];
    }

    return obj;
  }

  static toValueArray(str)
  {
    let res = null;
    const strArray = Utils.toArray(str);

    if (strArray)
    {
      res = strArray.map(item => item.value);
    }

    return res;
  }

  static On_Enter_Do_Click(button)
  {
    window.addEventListener("keyup", On_Window_Keyup);
    function On_Window_Keyup(event)
    {
      if (event.which == 13) 
      {
        button.click();
      }
    }
  }
}

export default Utils;
