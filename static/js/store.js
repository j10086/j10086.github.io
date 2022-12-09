function removeClass(element, className) {
	element.className = element.className.replace(className,'');
}
function addClass(element, className) {
	element.classList.add(className);
}
function detailtab(detailTabParam,detailTabButtonParam){
  if(document.querySelectorAll('[data-detail="theme-product-details"]')[0]){
    document.querySelectorAll('[data-detail="theme-product-details"]')[0].style.display = 'none';
  }
  if(document.querySelectorAll('[data-detail="theme-product-specification"]')[0]){
    document.querySelectorAll('[data-detail="theme-product-specification"]')[0].style.display = 'none';
  }
  var detailTabParam = document.querySelectorAll('[data-detail="'+detailTabParam+'"]')[0];
  detailTabParam.style.display = 'block';
  if(document.querySelectorAll('[data-detail-tab-button="theme-product-detail-tab-button"]')[0]){
    document.querySelectorAll('[data-detail-tab-button="theme-product-detail-tab-button"]')[0].className = document.querySelectorAll('[data-detail-tab-button="theme-product-detail-tab-button"]')[0].className.replace('theme-prod-detail-tab-active','');
  }
  if(document.querySelectorAll('[data-detail-tab-button="theme-product-specification-tab-button"]')[0]){
    document.querySelectorAll('[data-detail-tab-button="theme-product-specification-tab-button"]')[0].className = document.querySelectorAll('[data-detail-tab-button="theme-product-specification-tab-button"]')[0].className.replace('theme-prod-detail-tab-active','');
  }
  var detailTabButtonParam = document.querySelectorAll('[data-detail-tab-button="'+detailTabButtonParam+'"]')[0];
  detailTabButtonParam.className = detailTabButtonParam.className.replace('theme-prod-detail-tab-active','');
  addClass(detailTabButtonParam,'theme-prod-detail-tab-active');
}

function activeThumbnail(){
    var prodId;
    var thumbNailsAtt = document.querySelectorAll('[data-thumbnail]');
    for(dt=0;dt<thumbNailsAtt.length;dt++){
        prodId = thumbNailsAtt[dt].getAttribute('data-thumbnail');
    }
    var thumbNails = document.querySelectorAll('[data-thumbnail="'+prodId+'"]');
    for(tn=0;tn < thumbNails.length; tn++){
       removeClass(thumbNails[tn],'theme-active-thumbnail');
    }
    if(thumbNails[0]){
      addClass(thumbNails[0],'theme-active-thumbnail');
    }
}
document.addEventListener("DOMContentLoaded", function(event) {
	activeThumbnail();
});
function productQuantity(event) {
  var key = event.which || event.keyCode;
  var result;
  if (key == 8 || key == 46 || key == 37 || key == 39 || ( key > 47 && key < 58 )) {
    result = true;
  }
  else {
    result = false;
  }
  return result;
}
function getTargetContainer(element) {
  var targetContainer = (element) ? element.closest("[data-zs-product-id]") : "";
  return targetContainer;
}
function increaseCount(e){
	var targetContainer = getTargetContainer(e);
  var quantity_input = (targetContainer && targetContainer != "") ? targetContainer.querySelector("[data-zs-quantity]") : "";
  var quantity = quantity_input.value;
  if( !isNaN( quantity )){
    quantity_input.value++;
  }
  return false;
}
function decreaseCount(e){
	var targetContainer = getTargetContainer(e);
  var quantity_input = (targetContainer && targetContainer != "") ? targetContainer.querySelector("[data-zs-quantity]") : "";
  var quantity = quantity_input.value;
  if( !isNaN( quantity ) && quantity > 1 ) {
    quantity_input.value--;
  }
  return false;
}
function selectcolor(currentcolor,selectedAttribute){
	var targetContainer = getTargetContainer(currentcolor);
	var currentcolorInput = currentcolor.firstElementChild;
	var colorAttrNameContainer = targetContainer.querySelectorAll('[data-zs-attribute-name="'+selectedAttribute+'"]')[0];
	var colorLabel = colorAttrNameContainer.querySelectorAll("[data-theme-color-label]");
	for(var cc = 0; cc < colorLabel.length; cc++){
		removeClass(colorLabel[cc],'chekedLabel');
	}
	if (currentcolorInput.checked == true){
		addClass(currentcolor,'chekedLabel');
	}
	else{
		removeClass(currentcolor,'chekedLabel');
	}
}
function selectVariant(currentVariant,selectedAttribute){
	var targetContainer = getTargetContainer(currentVariant);
	var currentVariantInput = currentVariant.firstElementChild;
	var variantAttrNameContainer = targetContainer.querySelectorAll('[data-zs-attribute-name="'+selectedAttribute+'"]')[0];
	var variantLabel = variantAttrNameContainer.querySelectorAll("[data-theme-variant-label]");
	for(var cc = 0; cc < variantLabel.length; cc++){
		removeClass(variantLabel[cc],'chekedLabel');
	}
	if (currentVariantInput.checked == true){
		addClass(currentVariant,'chekedLabel');
	}
	else{
		removeClass(currentVariant,'chekedLabel');
	}
}
function viewProductQuickLook (span) {
  var productLookUpUrl = span.getAttribute("data-zs-product-url");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("product_quick_look").innerHTML = this.responseText;
			$E.dispatch(document.body,'quickview:opened');

			try {
      cart.productQuickLookAddToCart();
      } catch(e) {
      }

      var thumbNailsAtt = document.querySelectorAll('[data-thumbnail]');
			var prodId;
      for(dt=0;dt<thumbNailsAtt.length;dt++){
          prodId = thumbNailsAtt[dt].getAttribute('data-thumbnail');
      }
			if(prodId){
	      var thumbNails = document.querySelectorAll('[data-thumbnail="'+prodId+'"]');
	      for(tn=0;tn < thumbNails.length; tn++){
	         removeClass(thumbNails[tn],'theme-active-thumbnail');
	      }
	      if(thumbNails[0]){
	        addClass(thumbNails[0],'theme-active-thumbnail');
	      }
			}
			multi_currency.convertCurrencyPrice();
    }
  };
  xhttp.open("GET", productLookUpUrl, true);
  xhttp.send();
	document.getElementsByTagName("body")[0].style.overflow = 'hidden';
}

function closeProductQuickLook (e) {
	var prodQuickLook = document.getElementById("product_quick_look");
	if(prodQuickLook){
  	document.getElementById("product_quick_look").innerHTML = "";
	}
	document.getElementsByTagName("body")[0].style.overflow = 'auto';
	$E.dispatch(document.body,'quickview:closed');
}

document.onkeydown = function(e) {
    e = e || window.event;
    if (e.keyCode == 27) {
        closeProductQuickLook();
    }
};

function showDetailImage(imageUrl,imgId,prodId){
	var imageLoadingOverlay = document.querySelectorAll('[data-theme-image-overlay="theme-image-overlay-'+prodId+'"]')[0];
	imageLoadingOverlay.style.display = "block";
  var detailImage = document.querySelectorAll('[data-detail-image="theme-detail-image-'+prodId+'"]')[0];
  var activeImage = document.querySelectorAll('[data-thumbnail-active="'+imgId+'"]')[0];
  detailImage.setAttribute('src',imageUrl);
	detailImage.onload = function(){
		imageLoadingOverlay.style.display = "none";
	}
  var thumbNails = document.querySelectorAll('[data-thumbnail="'+prodId+'"]');
  for (i=0;i<thumbNails.length;i++){
    thumbNails[i].className = thumbNails[i].className.replace('theme-active-thumbnail','');
  }
  addClass(activeImage,'theme-active-thumbnail');
}

function hideCurrency(){
    var currencyList = document.querySelectorAll('[data-theme-currency-list]');
    var currencyListContainer = document.querySelector('[data-theme-currency-list-ul]');
    var currencyHideOverlay = document.querySelector('[data-theme-currency-hide-overlay]');
		var resMenu = document.querySelector('[data-non-res-menu="zptheme-menu-non-res"]');
    for(cur=0;cur<currencyList.length;cur++){
      currencyList[cur].style.display = 'none';
      currencyListContainer.firstChild.style.display = "flex";
      removeClass(currencyListContainer,'theme-currency-open');
		}
    currencyHideOverlay.style.display = "none";
		removeClass(resMenu,'theme-change-zindex');
}
function closeCurrencyMobile(){
	var currencyList = document.querySelectorAll('[data-theme-currency-list]');
	var currencyListContainer = document.querySelector('[data-theme-currency-list-ul]');
	var currencyHideMobile = document.querySelector('[data-theme-currency-hide-mobile]');
	var currencyMobileOpenTop = document.querySelector('[data-theme-currency-open-top]');
	var menuId = currencyListContainer.getAttribute('data-theme-currency-list-ul');
  var menuClose = document.querySelector('[data-zp-burger-clickable-area="'+menuId+'"]');
	var resMenu = document.querySelector('[data-non-res-menu="zptheme-menu-non-res"]');
	for(cur=0;cur<currencyList.length;cur++){
		currencyList[cur].style.display = 'none';
		currencyListContainer.firstChild.style.display = "flex";
		removeClass(currencyListContainer,'theme-currency-open');
	}
	menuClose.click();
	currencyHideMobile.style.display = "none";
	currencyMobileOpenTop.style.display = "none";
	removeClass(resMenu,'theme-change-zindex');
}
function currentCurrency(currentList){
	var currencyListContainer = document.querySelector('[data-theme-currency-list-ul]');
	var currenyOpen = currencyListContainer.classList.contains('theme-currency-open');
  var currencyList = document.querySelectorAll('[data-theme-currency-list]');
	var menuId = currencyListContainer.getAttribute('data-theme-currency-list-ul');
  var currencyMobileOpenTop = document.querySelector('[data-theme-currency-open-top]');
  var menuClose = document.querySelector('[data-zp-burger-clickable-area="'+menuId+'"]');
	if(currentList != currencyListContainer.childNodes[0]){
		currencyListContainer.insertBefore(currentList,currencyListContainer.childNodes[0]);
		multi_currency.change(currentList.innerText);
	}
	if(currenyOpen == true){
		menuClose.click();
	}
  currencyMobileOpenTop.style.display = "none";
  if(window.innerWidth <= 992){
      for(cur=0;cur<currencyList.length;cur++){
          currencyList[cur].style.display = 'none';
          currencyListContainer.firstChild.style.display = "flex";
          removeClass(currencyListContainer,'theme-currency-open');
      }
  }
}

function informMerchantAboutFailureTransaction() {
    if(typeof cart != "undefined"){
        cart.mailMerchantAboutFailureTransaction();
    }
}
