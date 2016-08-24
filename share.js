let share = (network) => {

  let title = "Россия на пороге эпидемии ВИЧ";
  let description = "Тревожные факты о масштабах бедствия — в спецпроекте «Газеты.Ru»";
  let link = "http://dyn.ig.rambler.ru/HIV-spread/";
  let closeLink = "http://dyn.ig.rambler.ru/HIV-spread/close.html"
  let twitterText = title + "." + " " + description;
  let image = "http://dyn.ig.rambler.ru/HIV-spread/share-img.png"

  if (network == "vk") {
    let url = "http://vk.com/share.php?url=" + link + "&description=" +
      description + "&image=" + image + "&title=" + title;
    window.open(url, "_blank", "width=400,height=500");
  } else if (network == "fb") {
    let appId = 610415715785775;
    let url = "https://www.facebook.com/dialog/feed?app_id=" + appId +
      "&description=" + description + "&display=popup&link=" + link + "&name=" + title + "&next=" +
      closeLink + "&picture=" + image;
    window.open(url, "_blank", "width=400,height=500");
  } else if (network == "tw") {
    let url = "https://twitter.com/intent/tweet?original_referer=" + link +
      "&text=" + twitterText + "&tw_p=tweetbutton&url=" + link;
    window.open(url, "_blank", "width=400,height=500");
  }
}

export default share;
