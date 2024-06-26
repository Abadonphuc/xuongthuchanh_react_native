import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../stack/Header'
import AppSearch from '../../commond/AppSearch'
import AppFlatListProductHome from '../../commond/AppFlatListProductHome'
import RenderHistorySearch from '../../renderList/RenderHistorySearch'
import styles from '../../commond/AppStyles'
import { useNavigation } from '@react-navigation/native'
import RenderSearch from '../../renderList/RenderSearch'
import ProductApi from '../../api/ProductApi'
const Search = () => {



  const historySearch = [
    {
      "_id": 1,
      "name": "Allianora",
      "time": "4/11/2023"
    },
    {
      "_id": 2,
      "name": "Kimmi",
      "time": "6/9/2023"
    },
    {
      "_id": 3,
      "name": "Maryrose",
      "time": "6/20/2023"
    },
    {
      "_id": 4,
      "name": "Jereme",
      "time": "4/14/2023"
    },
    {
      "_id": 5,
      "name": "Sander",
      "time": "1/9/2024"
    }
  ];

  const navigation = useNavigation();
  const [search, setsearch] = useState('')
  const [page, setpage] = useState(1)
  const [isFocus, setisFocus] = useState(false);

  const [datapro, setdatapro] = useState(historySearch);

  const renderitem = ({ item }) => {
    return (
      item.price ? <RenderSearch item={item} navigation={navigation} type={'Search'} /> :
        <RenderHistorySearch item={item} setsearch={setsearch} setdatapro={setdatapro} />
    )
  }

  const SearchProduct = async (text, page) => {
    if (text) {
      const body = {
        limit: 8,
        page: page,
        key: text
      }
      const result = await ProductApi.getProductWithKey(body);

      if (page == 1 && result.status) {
        setdatapro(result.data)
      }
      else if (result.status) {
        setdatapro([...datapro, ...result.data]);
      } else {
        Alert.alert("lỗi")
      }
    }
  }


  const handleScroll = async (event) => {
    const { y } = event.nativeEvent.contentOffset;
    const { height } = event.nativeEvent.layoutMeasurement;
    const contentSize = event.nativeEvent.contentSize.height;

    if (height + y >= contentSize - 50 && datapro[0].price) {
      setpage(page + 1);
      await SearchProduct(search, page + 1);
    }

  };

  return (
    <View style={style.container}>
      <Header
        iconLeft={require('../../resources/images/arrowLeft.jpg')}
        title={'Tìm kiếm'}
        iconRight={null}
        eventLeft={() => console.log("left")}
        eventRight={() => console.log("right")} />

      <View style={style.bodycontainer} >
        <AppSearch
          img={require('../../resources/images/search.png')}
          placeholder={'Tìm kiếm'}
          value={search}
          setvalue={setsearch}
          setisFocus={setisFocus}
          setpage={setpage}
          SearchProduct={SearchProduct}
          setdatapro={setdatapro}
        />

        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          <AppFlatListProductHome
            styletitle={style.titlettext}
            data={datapro}
            title={datapro.length == 0 ? null : datapro[0].time ? 'Tìm kiếm gần đây' : null}
            number={1}
            textEmpty={'Không tìm thấy'}
            renderitem={renderitem}
          />
          <View style={{ height: 100 }} />
        </ScrollView>



      </View>
    </View>
  )
}

const style = StyleSheet.create({
  titlettext: {
    ...styles.font2,
    fontSize: 16,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    ...styles.backgroundAll
  },
  bodycontainer: {
    ...styles.backgroundAll,
    paddingHorizontal: 24,
  }
})

export default Search