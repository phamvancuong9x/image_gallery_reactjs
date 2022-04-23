import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Input, Row } from "reactstrap";
import { useEffect, useState } from "react";
const Header = () => {
  return (
    <div
      className="header"
      onClick={() => {
        window.location.reload();
      }}
    >
      <h3 className="header_title">Image Gallery</h3>
    </div>
  );
};
const ImagePopupBox = ({
  listImages,
  infoImageCurrent,
  setInfoImageCurrent,
  setShowBox,
}) => {
  const handleArrowLeft = (index) => {
    let newIndex;
    if (index == 0) {
      newIndex = listImages.length - 1;
    } else {
      newIndex = index - 1;
    }
    const urlPrev = listImages[newIndex].urlsRegular;
    setInfoImageCurrent({ index: newIndex, url: urlPrev });
  };
  const handleArrowRight = (index) => {
    let newIndex;
    if (index == listImages.length - 1) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }
    const urlNext = listImages[newIndex].urlsRegular;
    setInfoImageCurrent({ index: newIndex, url: urlNext });
  };
  return (
    <div className="modals">
      <div className="container_modal container">
        <div className="modal_image">
          <img
            src={infoImageCurrent.url}
            alt="image"
            className="modal_image-item"
          />
        </div>
        <div
          className="btn btn-left"
          onClick={() => handleArrowLeft(infoImageCurrent.index)}
        >
          <i className="bi bi-arrow-left-circle"></i>
        </div>
        <div
          className="btn btn-right"
          onClick={() => handleArrowRight(infoImageCurrent.index)}
        >
          <i className="bi bi-arrow-right-circle"></i>
        </div>
      </div>
      <div className="btn btn-closes" onClick={() => setShowBox(false)}>
        <i className="bi bi-x-octagon"></i>
      </div>
    </div>
  );
};

const ListImage = ({
  resultSearch,
  listImages,
  setShowBox,
  setInfoImageCurrent,
}) => {
  const handleShowBox = (infoImage) => {
    setInfoImageCurrent(infoImage);
    setShowBox(true);
  };

  return (
    <Row className="g-4 listImage">
      {resultSearch ? <h3>Không có kết quả tìm kiếm phù hợp</h3> : false}
      {listImages.map((data, i) => {
        return (
          <Col lg="3" md="4" sm="6" key={i}>
            <div
              className="image "
              onClick={() => handleShowBox({ index: i, url: data.urlsRegular })}
            >
              <img src={data.urls} className="img-item" />
              <div className="info-name">
                {data.alt_description || data.description || "No description"}
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};
const Search = ({ handleSearch }) => {
  const [value, setValue] = useState("");
  const handleKeyPress = (e) => {
    if (e.charCode == 13) {
      handleSearch(value, setValue);
    }
  };
  return (
    <Row className="mb-5 mt-4">
      <Col lg="6" className="search-group">
        <div className="search d-flex justify-content-center align-item-center ">
          <Input
            placeholder="search"
            className="me-2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="icon_search d-flex justify-content-center align-items-center px-3"
            onClick={() => handleSearch(value, setValue)}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </Col>
    </Row>
  );
};
const BackToTop = ({ setShowBackToTop }) => {
  const handleBackToTop = () => {
    document.documentElement.scrollTop = 0;
  };
  useEffect(() => {
    const handleBackToTop = () => {
      if (document.documentElement.scrollTop <= 500) {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleBackToTop);

    return () => {
      window.removeEventListener("scroll", handleBackToTop);
    };
  });
  return (
    <div className="back_to_top" onClick={handleBackToTop}>
      <i className="bi bi-arrow-up-circle"></i>
    </div>
  );
};

function ImageGallery() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listImages, setListImages] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [resultSearch, setResultSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [infoImageCurrent, setInfoImageCurrent] = useState("");
  const [showBox, setShowBox] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    if (endPage) return;

    const handlePageChange = () => {
      let height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (document.documentElement.scrollTop >= height && !loadingPage) {
        setPage(() => page + 1);
        setLoadingPage(true);
      }
    };
    window.addEventListener("scroll", handlePageChange);
    return () => window.removeEventListener("scroll", handlePageChange);
  });
  useEffect(() => {
    const handleBackToTop = () => {
      if (document.documentElement.scrollTop > 500) {
        setShowBackToTop(true);
      }
    };
    window.addEventListener("scroll", handleBackToTop);

    return () => {
      window.removeEventListener("scroll", handleBackToTop);
    };
  });
  useEffect(() => {
    if (!isSearchPage) return;
    setResultSearch(false);
    fetch(
      `https://api.unsplash.com/search/photos/?client_id=f7N-c7ynV9x6FAE3c1mP35-_1uRQeFNKMYlRro55XGA&page=${page}&query=${keySearch}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLoadingPage(false);
        if (data.results.length == 0) {
          setResultSearch(true);
        }
        // else {
        //   setValue("");
        // }
        const newListImages = data.results.map((value) => {
          return {
            id: value.id,
            urls: value.urls.small,
            urlsRegular: value.urls.regular,
            alt_description: value.alt_description,
            description: value.description,
          };
        });

        if (page == 1) {
          return setListImages(newListImages);
        }
        setListImages([...listImages, ...newListImages]);
      })
      .catch((error) => {
        setEndPage(true);
        setResultSearch(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keySearch, page]);

  useEffect(() => {
    if (isSearchPage) return;
    fetch(
      `https://api.unsplash.com/photos/?client_id=f7N-c7ynV9x6FAE3c1mP35-_1uRQeFNKMYlRro55XGA&page=${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        const newListImages = data.map((value) => {
          return {
            id: value.id,
            urls: value.urls.small,
            urlsRegular: value.urls.regular,
            alt_description: value.alt_description,
            description: value.description,
          };
        });
        setListImages([...listImages, ...newListImages]);
        setLoading(false);
        setLoadingPage(false);
      })
      .catch((error) => {
        setEndPage(true);
        setLoadingPage(false);
        setLoading(false);
        if (page == 1) {
          setError(error);
        }
      });
  }, [page]);
  const handleSearch = (value, setValue) => {
    if (value == "" || value == keySearch) return;
    setLoading(true);
    setIsSearchPage(true);
    setPage(1);
    setError(null);
    setKeySearch(value);
    setValue("");
  };

  return (
    <div className="main">
      <Header />
      <Container>
        <Search handleSearch={handleSearch} />
        {loading ? <h3>Loading ...</h3> : false}
        {error ? <h3>Error !</h3> : false}
        <ListImage
          resultSearch={resultSearch}
          listImages={listImages}
          setShowBox={setShowBox}
          setInfoImageCurrent={setInfoImageCurrent}
        />
        {showBox ? (
          <ImagePopupBox
            listImages={listImages}
            infoImageCurrent={infoImageCurrent}
            setInfoImageCurrent={setInfoImageCurrent}
            setShowBox={setShowBox}
          />
        ) : (
          false
        )}
        {showBackToTop && <BackToTop setShowBackToTop={setShowBackToTop} />}
        {loadingPage ? (
          <h3 style={{ margin: "40px 0 220px 0" }}>Loading...</h3>
        ) : (
          false
        )}
        {endPage ? <h3 style={{ margin: "40px 0 220px 0" }}>End !</h3> : false}
      </Container>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <ImageGallery />
    </div>
  );
}

export default App;
