var SORT_BY_PLACEHOLDER = '[data-sort-by-products]';
var MORE_PRODUCT = 'data-has-more-products';
var LAZY_LOAD = 'data-lazy-load-products';
var SORT_BY_PRODUCTS_VALUE = 'data-sort-by-val';
var SORT_BY_TARGET = '[data-sort-by-products-target]';
var MAX_LAZY_COUNT = 2;
var lazy_load_count;
var api_requested = false;

function initSortByPorducts() {
    lazy_load_count = 0;
    _bindSortByProducts();
    _bindPagination();
}

function _bindSortByProducts() {
    var sortByDD = document.querySelectorAll(SORT_BY_PLACEHOLDER);
    if(sortByDD.length == 0){
      return;
    }

    if(sortByDD[0] && sortByDD[0].tagName === 'SELECT') {
      sortByDD[0].addEventListener('change', _changeSortByProducts, false);
    } else {
        sortByDD.forEach(function(sort_by) {
          sort_by.addEventListener('click', _clickSortByProducts, false);
        });
    }
}

function _bindPagination() {
    var scroll_area = document.querySelector('[' + LAZY_LOAD + ']');
    if(scroll_area) {
        if('IntersectionObserver' in window) {
            var options = {
                root       : null,
                rootMargin : '0px',
                threshold  : 0.2
            };
            var observer = new IntersectionObserver(lazyLoadCallBack, options);
            observer.observe(scroll_area);
        } else {
            document.removeEventListener("scroll", onSrollLazyLoad, false);
            document.addEventListener('scroll', onSrollLazyLoad, false);
        }

    } else {
        var more_product = document.querySelector('[' + MORE_PRODUCT + ']');
        if(!more_product) {
            return;
        }
        more_product.addEventListener('click', _loadMoreProduct, false);
    }

}

function onSrollLazyLoad() {
    var scroll_area = document.querySelector('[' + LAZY_LOAD + ']');
    if(scroll_area && isElementInViewport(scroll_area)) {
        fnLazyLoad(scroll_area);
    }
}

function isElementInViewport (el) {
   	var scroll = window.pageYOffset || document.documentElement.scrollTop
    return scroll > el.offsetTop - window.innerHeight/2;
}

function lazyLoadCallBack(entries, observer) {

    entries.forEach( function(entry) {
        if(entry.isIntersecting) {
            var target_element = entry.target;

            if(target_element == null) {
                return;
            }

            fnLazyLoad(target_element);
        }
    });
}

function fnLazyLoad(lazy_load_element) {
    var current_page = parseInt(lazy_load_element.getAttribute('data-current-page-number'));
    current_page++;

    var params = {
        page_number : current_page
    }

    var sortByDD = document.querySelectorAll(SORT_BY_PLACEHOLDER);
    if(sortByDD.length > 0) {
        var clickSortByProducts = document.querySelector('[data-sort-by-products][data-selected]');
        if(clickSortByProducts) {
            params.sort_by = clickSortByProducts.getAttribute('data-sort-by-val');
        } else {
            if(sortByDD[0] && sortByDD[0].value != "") {
                params.sort_by = sortByDD[0].value;
            }
        }
    }

    if(api_requested) {
        return;
    }
    api_requested = true

    lazy_load_count++;
    loadProducts(params, 'append');
}

function _changeSortByProducts() {
    var params = {
        "sort_by" : this.value
    };

    // show blur loading

    var blurEl = document.querySelector(SORT_BY_TARGET);
    if(blurEl){
    	addClass(blurEl,'theme-blur-loading');
    }

    loadProducts(params, 'innerHTML');
}

function _clickSortByProducts(e) {
  var elem = e.target;
  var params = {
      "sort_by" : elem.getAttribute(SORT_BY_PRODUCTS_VALUE)
  };

  var sortByDD = document.querySelectorAll(SORT_BY_PLACEHOLDER);
  sortByDD.forEach(function(sort_by) {
      sort_by.removeAttribute('data-selected');
      removeClass(sort_by,'theme-active-sortby');
  })
  elem.setAttribute('data-selected', 'true');
  addClass(elem,'theme-active-sortby');
  loadProducts(params, 'innerHTML');
}

function _loadMoreProduct() {

    if(api_requested) {
        return;
    }
    api_requested = true;

    var current_page = parseInt(this.getAttribute('data-current-page-number'));
    current_page++;

    var params = {
        page_number : current_page
    }

    var sortByDD = document.querySelectorAll(SORT_BY_PLACEHOLDER);
    if(sortByDD.length > 0) {
      var clickSortByProducts = document.querySelector('[data-sort-by-products][data-selected]');
      if(clickSortByProducts) {
        params.sort_by = clickSortByProducts.getAttribute('data-sort-by-val');
      } else {
        if(sortByDD[0] && sortByDD[0].value != "") {
            params.sort_by = sortByDD[0].value;
        }
      }
    }

    loadProducts(params, 'append');
}

function loadProducts(params, insert_type) {
    sort_by_products.getProducts(params, insert_type);
}

function getProductsResponse(e) {
    api_requested = false;

    var data = e.detail;
    var target = document.querySelector(SORT_BY_TARGET);
    if(!target) {
        return;
    }

    //remove load more or lazy load element
    var lazy_load_elem = document.querySelector('[' + LAZY_LOAD + ']');
    if(lazy_load_elem) {
        $D.remove(lazy_load_elem);
    }

    var load_more_elelment = document.querySelector('[' + MORE_PRODUCT + ']');
    if(load_more_elelment) {
        $D.remove(load_more_elelment);
    }

    if(data.insert_type === 'append') {
        target.insertAdjacentHTML('beforeend', data.content);

        //three time lazy load and then convert to load more button

        if(lazy_load_count >= MAX_LAZY_COUNT) {
            var lazy_load_elem = document.querySelector('[' + LAZY_LOAD + ']');

            if(lazy_load_elem) {
                lazy_load_elem.removeAttribute(LAZY_LOAD);
                lazy_load_elem.setAttribute(MORE_PRODUCT, "");

                // $D.addClass(lazy_load_elem, "zpbutton-wrapper zpbutton zpbutton-type-primary zpbutton-size-md zpbutton-style-none");
                lazy_load_elem.innerHTML = '<span class="zpbutton-wrapper zpbutton zpbutton-type-primary zpbutton-size-md zpbutton-style-none">'+i18n.get("product.pagination.loadmore")+'</span>';
            }
        }
    } else if(data.insert_type === 'innerHTML') {

        // hide blur loading

        var blurEl = document.querySelector(SORT_BY_TARGET);
        if(blurEl){
        	removeClass(blurEl,'theme-blur-loading');
        }

        target.innerHTML = data.content;
        lazy_load_count = 0;

        try{
          product_review.clearCache();
        }
        catch(e){

        }

    }

    try {
    	cart.productQuickLookAddToCart(target);
    } catch (e) {
    }

    multi_currency.convertCurrencyPrice();

    product_option.init();
    product_option.resetAddToCart("", document);
    image_lazy_load.init();
    _bindPagination();
}

initSortByPorducts();
document.addEventListener("zs-event-get-products-list-success", getProductsResponse, false);
