const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');
const walmartAPI = 'https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json';
const walmartPreflightAPI = 'https://www.walmart.com/pharmacy/v2/clinical-services/time-slots/51e8dfab-bda0-42e6-b734-0767f0e22eb1';
const scheduleURL = '';

dotenv.config();

const webhookURL = process.env.WALMART_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);

// const options = {
//   'headers': {
//     'accept': 'application/json',
//     'accept-language': 'en-US,en;q=0.9',
//     'content-type': 'application/json',
//     'rx-electrode': 'true',
//     'sec-fetch-dest': 'empty',
//     'sec-fetch-mode': 'cors',
//     'sec-fetch-site': 'same-origin',
//     'wpharmacy-source': 'web/chrome88.0.4324/OS X 11.2.1/51e8dfab-bda0-42e6-b734-0767f0e22eb1',
//     'wpharmacy-trackingid': 'd8a71460-2486-4c73-8d15-615bbd88f1ff',
//     'cookie': 'brwsr=4665141e-4558-11eb-a229-42010a246cc5; DL=78704%2C%2C%2Cip%2C78704%2C%2C; vtc=bc9GJBKi8GKoZDFfKdNuMI; _gcl_au=1.1.671920547.1608753101; _pxvid=46d96e3a-4558-11eb-800a-0242ac12000f; s_pers_2=om_mv3d%3Daff%3Aadid-%3Asourceid-imp_wBtxkHwlExyLWUJwUx0Mo3b1UkEUTU2PUzwNzI0%3Awmls-imp_1943169%3Acn-%7C1610661308534%3B%20%2Bom_mv7d%3Daff%3Aadid-%3Asourceid-imp_wBtxkHwlExyLWUJwUx0Mo3b1UkE3vIQeUzwNzI0%3Awmls-imp_159047%3Acn-%7C1609361501151%3B%20%2Bom_mv14d%3Daff%3Aadid-%3Asourceid-imp_wBtxkHwlExyLWUJwUx0Mo3b1UkE3vIQeUzwNzI0%3Awmls-imp_159047%3Acn-%7C1609966301152%3B%20%2Bom_mv30d%3Daff%3Aadid-%3Asourceid-imp_wBtxkHwlExyLWUJwUx0Mo3b1UkE3vIQeUzwNzI0%3Awmls-imp_159047%3Acn-%7C1611348701153%3B%20useVTC%3DY%7C1671896971%3B%20om_mv7d%3Daff%3Aadid-%3Asourceid-imp_wBtxkHwlExyLWUJwUx0Mo3b1UkEUTU2PUzwNzI0%3Awmls-imp_1943169%3Acn-%7C1611006908535%3B%20om_mv14d%3Daff%3Aadid-%3Asourceid-imp_wBtxkHwlExyLWUJwUx0Mo3b1UkEUTU2PUzwNzI0%3Awmls-imp_1943169%3Acn-%7C1611611708535%3B%20om_mv30d%3Daff%3Aadid-%3Asourceid-imp_wBtxkHwlExyLWUJwUx0Mo3b1UkEUTU2PUzwNzI0%3Awmls-imp_1943169%3Acn-%7C1612994108536; hasACID=1; cart-item-count=1; _abck=fucnoao8s3cgwtpj3xoz_2028; tracker_device=0da6c2dd-d271-485d-83c1-38af62fba6e7; _ga=GA1.2.1722694719.1610597324; TBV=7; tb_sw_supported=true; s_vi=[CS]v1|300DAA2F99B85781-400008ECD0154DE2[CE]; wm_ul_plus=INACTIVE|1613057321333; rtoken=MDgyNTUyMDE4o6GMM4250TJ2Y4hU0ih2bR0VIy%2FYqc4yBmhOIaZKa2HqKOH0Y4C0FIsTSnvCc%2Bblpt68iZnQjYZwhO%2BnPppU4Ln%2FR3LYUjUhW%2Fom0n0P9bLBDrkAYxxD4RDKCfzQAXJHOnF2IolnDjcur6wctlVivHeKUGyElX5Z2BlQVaKzKqlA5cgI4NVBpMoeRzoHq3E3Z23uy3Iqwf89i7LUUFQe8d55NvJ4xQ5Hn5V2%2Bre1CpPyT2hFqUHdRCfxQm6Zg1FPOMYwTvhafHq50tg%2FAEaAUUF6tUfMH15Akbw2rltXa%2BymmZW3UGFgCMLRKQPK549O%2B3RJkxg5TWXbTJ9pDc7x4gisbH%2FqlFnCHyzcG%2BbflvolS5xxZVGLl5uyI00UdfW3spbz%2BVl8I5aMrMuGIAt97w%3D%3D; SPID=a37a763004d15d16a10c7ea06df65672f6eabe27f1d75193739ceb023efe191ab0b70314ec1d8aa1659019ba7f3e9bd3myacc; CID=51e8dfab-bda0-42e6-b734-0767f0e22eb1; hasCID=1; customer=%7B%22firstName%22%3A%22James%22%2C%22lastNameInitial%22%3A%22C%22%2C%22rememberme%22%3Atrue%7D; type=REGISTERED; WMP=4; com.wm.reflector="reflectorid:0000000000000000000000@lastupd:1613150285339@firstcreate:1613065037975"; next-day=null|true|true|null|1613150285; location-data=78704%3AAustin%3ATX%3A%3A1%3A1|yt%3B%3B1.92%2C1n9%3B%3B3.38%2C43p%3B%3B5.72%2C3ii%3B%3B7.85%2Cwx%3B%3B8.01%2C397%3B%3B11.49%2C2r5%3B%3B12.85%2C2g1%3B%3B15.14%2Cvd%3B%3B15.35%2C36q%3B%3B17.15||7|1|1yic%3B16%3B1%3B2.07%2C1yai%3B16%3B2%3B2.68%2C1yif%3B16%3B4%3B3.63%2C1yah%3B16%3B5%3B5.15; TB_Latency_Tracker_100=1; TB_Navigation_Preload_01=1; TB_SFOU-100=1; TB_DC_Flap_Test=0; bstc=U70Q35JVwtOk2LaZRpA9QU; mobileweb=0; xpa=5Z16k|CwCFe; exp-ck=CwCFe2; TS01b0be75=01538efd7c80acbaceb136fb95ee6afa7599a2de8373821b025ec6a8c75f66d74fb85b0b2f25586cf640cb62baa808da60ca3bad24; TS013ed49a=01538efd7c80acbaceb136fb95ee6afa7599a2de8373821b025ec6a8c75f66d74fb85b0b2f25586cf640cb62baa808da60ca3bad24; adblocked=true; viq=Walmart; _uetsid=2b1533a06bb411eb8804bd6788cdb397; _uetvid=3cd7cf50668c11ebba3c27a70c862804; xpm=1%2B1613150285%2Bbc9GJBKi8GKoZDFfKdNuMI~51e8dfab-bda0-42e6-b734-0767f0e22eb1%2B0; TS011baee6=01c5a4e2f99acd906a44d4cd9eeee51b03a312a646de6d5999e94ca11b205f578653496a1ddbc7d2a55fa25e27aa880fca142694ad; TS01e3f36f=01c5a4e2f99acd906a44d4cd9eeee51b03a312a646de6d5999e94ca11b205f578653496a1ddbc7d2a55fa25e27aa880fca142694ad; TS018dc926=01c5a4e2f99acd906a44d4cd9eeee51b03a312a646de6d5999e94ca11b205f578653496a1ddbc7d2a55fa25e27aa880fca142694ad; auth=MTAyOTYyMDE40jV%2B%2FA%2FgsS%2BM0QeOvOdHbp%2BpKz45NbOGsd8M2FkMrJNDaAQ0Tm2S61PIaVtSrS7bNZB12tnho%2FSt909WrvtZ2oJrVaFj3%2BFpzrgHZqXK91LwBAJ285GG8rk86QS%2FW2zhSExbisshKcp%2BwQxakrozI253lFXr7h1OhkoELtTARwNNsCYgSjPA%2BWa4fNfxoeBCtHtbIxsX4QE5VuXKrBEoo1gRa0JHT%2Fe2SZs9RI19CY1UiUoTb3jgayHXj2tlrrSPg%2FpjqB3Y9U2wCDZmo31kyDRLI8R48NBiBdH5fZmfF4K5w4otPBpOyelEI0inG6jND%2BL30Setp%2BiNrM4VXiUuRzVveqGzNst19qXpVJMKowcRvgs2b3smxqHePpajvDFyscuBxzaQp2yJaF1C%2BR2liA%3D%3D; ACID=51e8dfab-bda0-42e6-b734-0767f0e22eb1; _px3=5b55f699117d2f5a5545cea3fb223ccedfdbd09e31d7d4093eee2895c1a49106:wyIJE+roioYVi83yf23iyrJzqFNOwRsh4RWLq5GEx61AygGNhryZcuWGR9tM9jAuQES+K+qQOVcCHKwhfJsXtQ==:1000:mLpdufKcJvAmuKg+HMpNs6WgaLb7izlq+CceSGx+BrvHH8ISb+l32wfHoxWasosoKJ3ADdv2ZljHMaJvv5GO8j8Pd0zY+zWECNhU4DmMTpGIhyTg4enJIMuEoMYOwj83yR+Ep5EnOMGeZML/pcjtW9k6hHtEnPfBrdS8T9nqxgI=; akavpau_p8=1613150904~id=0b97a51be3b38d4bcffd534d93608fae; _pxde=b85ad4535cacfd0674cf52a160ef2fe4d2add51ff27b1a4ea24acdf84aa0c130:eyJ0aW1lc3RhbXAiOjE2MTMxNTAzNDEwOTEsImZfa2IiOjAsImlwY19pZCI6W119; s_sess=%20cps%3D1%3B%20chan%3Dorg%3B%20v59%3Dundefined%3B%20v54%3Dundefined%3B; s_pers=%20s_cmpstack%3D%255B%255B%2527seo_un%2527%252C%25271613058148478%2527%255D%255D%7C1770824548478%3B%20om_mv3d%3Dseo_un%253A%7C1613317348510%3B%20om_mv7d%3Dseo_un%253A%7C1613662948512%3B%20om_mv14d%3Dseo_un%253A%7C1614267748514%3B%20om_mv30d%3Dseo_un%253A%7C1615650148515%3B%20s_v%3DY%7C1613152155071%3B%20gpv_p11%3Dno%2520value%7C1613152155081%3B%20gpv_p44%3Dno%2520value%7C1613152155086%3B%20s_vs%3D1%7C1613152155089%3B%20s_fid%3D6B3ACDC7674B0275-330DD794E8234F8D%7C1676222356210%3B',
//   },
//   'referrer': 'https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled?imzType=covid&r=yes',
//   'referrerPolicy': 'strict-origin-when-cross-origin',
//   'body': '{"startDate":"02122021","endDate":"02182021","imzStoreNumber":{"USStoreId":848}}',
//   'method': 'POST',
//   'mode': 'cors',
// };

const checkWalmart = async () => {
  const test = await fetch('https://www.walmart.com/pharmacy/v2/clinical-services/time-slots/51e8dfab-bda0-42e6-b734-0767f0e22eb1', {
    'headers': {
      'accept': 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'rx-electrode': 'true',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'wpharmacy-source': 'web/chrome88.0.4324/OS X 11.2.1/51e8dfab-bda0-42e6-b734-0767f0e22eb1',
      'wpharmacy-trackingid': 'b2393e91-7958-4b86-ad8b-d7234414a39d',
      'cookie': 'hasACID=1; _abck=c9snladss9hkvzzhbsgk_2073; s_pers_2=+s_v%3DY%7C1613161770235%3B+gpv_p11%3DAccount%253A%2520SignIn%7C1613161770240%3B+gpv_p44%3DAccount%7C1613161770242%3B+s_vs%3D1%7C1613161770244%3B+s_fid%3D60CACF0DECB94714-1AF51CE11DCE88CD%7C1676231973876%3BuseVTC%3DY%7C1676275173; s_sess_2=%20chan%3Dorg%3B%20v59%3DAccount%3B%20v54%3DAccount%253A%2520SignIn%3B; wm_ul_plus=INACTIVE|1613246374070; rtoken=MDgyNTUyMDE4o6GMM4250TJ2Y4hU0ih2bR0VIy%2FYqc4yBmhOIaZKa2HqKOH0Y4C0FIsTSnvCc%2Bblpt68iZnQjYZwhO%2BnPppU4Ln%2FR3LYUjUhW%2Fom0n0P9bLBDrkAYxxD4RDKCfzQAXJHWcuCb%2BjAA30%2FOyZGt1YSMtOiac1iRVOO5nrBZnb13HU6Wn%2Bmj%2BAo1bpWTaCONZWfy1EkBkz7EHm0i1iQdx48QipP%2FBxETnidkEnF9y6y0qWA0yZIyKKB%2FUmSwHrg%2BlGD0SQNQ0yhZ00E2GHvPTcJ9GUhXnHK6vB43BLXeQbYdaApS9sgCnqczQs9OQ8gcuF19vGD%2BmDmZ5wd8o8%2BAmF229IZc1PI9iyko9HgyHhLpAApI2f3DdEfH%2Fqo%2FC5M%2FCfw4o8Gyh2lGliXEJU0gtd2BQ%3D%3D; SPID=94784a355f1bc55142cd96145b7c7c09205d48738923c3c40e6fabacc5ee1020c9f7b2e5b342670b1b44cecff57c6964myacc; CID=51e8dfab-bda0-42e6-b734-0767f0e22eb1; hasCID=1; customer=%7B%22firstName%22%3A%22James%22%2C%22lastNameInitial%22%3A%22C%22%2C%22rememberme%22%3Atrue%7D; type=REGISTERED; WMP=4; TB_Latency_Tracker_100=1; TB_Navigation_Preload_01=1; TB_DC_Flap_Test=0; vtc=Uqn8HleUJCllY9FcLZFYag; bstc=Uqn8HleUJCllY9FcLZFYag; mobileweb=0; xpa=-TbQt|CwCFe|JA3ix; exp-ck=-TbQt2CwCFe2JA3ix1; TBV=7; _pxvid=d490a16d-6d6c-11eb-846c-0242ac12000e; xpm=1%2B1613159974%2BUqn8HleUJCllY9FcLZFYag~51e8dfab-bda0-42e6-b734-0767f0e22eb1%2B0; ACID=51e8dfab-bda0-42e6-b734-0767f0e22eb1; tb_sw_supported=true; location-data=78704%3AAustin%3ATX%3A%3A1%3A1|yt%3B%3B1.92%2C1n9%3B%3B3.38%2C43p%3B%3B5.72%2C3ii%3B%3B7.85%2Cwx%3B%3B8.01%2C397%3B%3B11.49%2C2r5%3B%3B12.85%2C2g1%3B%3B15.14%2Cvd%3B%3B15.35%2C36q%3B%3B17.15||7|1|1yic%3B16%3B1%3B2.07%2C1yai%3B16%3B2%3B2.68%2C1yif%3B16%3B4%3B3.63%2C1yah%3B16%3B5%3B5.15; DL=78704%2C%2C%2Cip%2C78704%2C%2C; TB_SFOU-100=1; com.wm.reflector="reflectorid:0000000000000000000000@lastupd:1613159985419@firstcreate:1613159985419"; TS011baee6=0130aff2329882cccfb2e9577c773d5d5968a7b69f58c78107c63029fcfd1a0865d703cd3cfb3f5f8182d4861fa3e6d7a4f156f836; TS01e3f36f=0130aff2329882cccfb2e9577c773d5d5968a7b69f58c78107c63029fcfd1a0865d703cd3cfb3f5f8182d4861fa3e6d7a4f156f836; TS018dc926=0130aff2329882cccfb2e9577c773d5d5968a7b69f58c78107c63029fcfd1a0865d703cd3cfb3f5f8182d4861fa3e6d7a4f156f836; next-day=null|true|true|null|1613161751; TBWL-94-pharmacyTimeslots=c97u6pgeggvx:0:3hn2qvj1bvned:1gzirgea3f3os; auth=MTAyOTYyMDE40jV%2B%2FA%2FgsS%2BM0QeOvOdHbp%2BpKz45NbOGsd8M2FkMrJNDaAQ0Tm2S61PIaVtSrS7bNZB12tnho%2FSt909WrvtZ2oJrVaFj3%2BFpzrgHZqXK91LwBAJ285GG8rk86QS%2FW2zhRa4t%2BM860oIDGmsT5n5qa4wbDIiMe3yZPK18qyoKuO0lURjWhLdbnuOPLaU0aOmMuFuyLSaovzALePBMy09F3lgRa0JHT%2Fe2SZs9RI19CY1UiUoTb3jgayHXj2tlrrSPvbAcvpKADSsetOFxT720nhGvIZdVMRfFM1E5HRYfx0au%2FHPG%2FPljTDp1vjmiV%2FPHRupUhHqspWtYlx66JwjKIMchuHkBeSEalmNtIVf%2FJuelhbLuM99g%2FAX0DPl68PJKlpzDKHiOaSv1NwIhcPhFmQ%3D%3D; TS01b0be75=01538efd7c068c7ee713e95e084a2777cfbf463691f3f7ae363213ad70ac122af4d80231b452177436edd76fc254f0ffbb8dd98b23; TS013ed49a=01538efd7c068c7ee713e95e084a2777cfbf463691f3f7ae363213ad70ac122af4d80231b452177436edd76fc254f0ffbb8dd98b23; _px3=e5f7442fb8913ab0d1ff170946f0538942e825182f2bd3315f2797b9185aff64:n6gbGzJgwCRuXHAt924yKcmFAMurkvKAmXMIFsOi2PiBW2hSdUqHYiIuZDgkpAmzF8zYkfGhh8TbSKGNOP1mXA==:1000:UsNQixsFVZSfmaPrRqNAt6dJ7414XRy2SsxcANBf+lL7r/VjDUN1JHhmSWbCg3L9L2HTyqcf1igGGyjStOFFogBopecIbV1y/KyNT3NR6cZzDJoVfhjolzq52Yj4mjTBzNxvKlCQBZZsf0RtDZ7DKJQFGw2w4MIAiqVzN9kbfGU=; _pxde=3dd7f2a483393da1a252a619c0437f453831d305f57c5a3f9d06c93adfc85392:eyJ0aW1lc3RhbXAiOjE2MTMxNjE5NjE4MjYsImZfa2IiOjAsImlwY19pZCI6W119; akavpau_p8=1613162564~id=6b2342ed65f17ca4eb489b06c34c335e; s_sess=%20s_sq%3D%3B%20s_cc%3Dtrue%3B%20cps%3D0%3B%20chan%3Dorg%3B%20v59%3DAccount%3B%20v54%3DAccount%253A%2520SignIn%3B; s_pers=%20s_v%3DY%7C1613163767455%3B%20gpv_p11%3Dno%2520value%7C1613163767469%3B%20gpv_p44%3Dno%2520value%7C1613163767474%3B%20s_vs%3D1%7C1613163767477%3B%20s_fid%3D60CACF0DECB94714-1AF51CE11DCE88CD%7C1676233967947%3B',
    },
    'referrer': 'https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled?imzType=covid&r=yes',
    'referrerPolicy': 'strict-origin-when-cross-origin',
    'body': '{"startDate":"02122021","endDate":"02182021","imzStoreNumber":{"USStoreId":381}}',
    'method': 'POST',
    'mode': 'cors',
  });
  const cookies = await test.headers.get('set-cookie');

  const next = await fetch('https://www.walmart.com/pharmacy/v2/clinical-services/time-slots/51e8dfab-bda0-42e6-b734-0767f0e22eb1', {
    'headers': {
      'accept': 'application/json',
      'content-type': 'application/json',
      'rx-electrode': 'true',
      'wpharmacy-source': 'web/chrome88.0.4324/OS X 11.2.1/51e8dfab-bda0-42e6-b734-0767f0e22eb1',
      'wpharmacy-trackingid': '482765b1-a446-4532-9200-33ff639226ee',
    },
    'referrer': 'https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled?imzType=covid&r=yes',
    'referrerPolicy': 'strict-origin-when-cross-origin',
    'body': '{"startDate":"02122021","endDate":"02182021","imzStoreNumber":{"USStoreId":381}}',
    'method': 'POST',
    'mode': 'cors',
  });

  const cookies2 = await test.headers.get('set-cookie');

  const res1 = await test.json();
  const res2 = await next.json();


  console.log(JSON.stringify(res1) + '\n\n');


  // try {
  //   console.log('Checking Walmart for vaccines...');
  //   let cookie;
  //   const response = await fetch('https://www.walmart.com/pharmacy/v2/clinical-services/time-slots/51e8dfab-bda0-42e6-b734-0767f0e22eb1', options);
  //   cookie = response.headers.get('set-cookie');
  //   const vaccineLocations = await response.json();

  //   if (response.status === 200) {
  //     console.log(cookie, vaccineLocations);
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
};

checkWalmart();

module.exports = checkWalmart;
