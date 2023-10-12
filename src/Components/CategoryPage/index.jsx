import React, { useState, useEffect } from "react";
import Wrapper from "Components/Wrapper";
import { Row, Col, Form, Table, InputGroup, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DynamicModal from "Constants/DynamicModal";
import { getCategory } from "Redux/Slices/Category/CategorySlice";
import { useNavigate } from "react-router-dom";
import DeleteDataModal from "./Modals/DeleteDataModal";
import { ErrorToaster, SuccessToaster } from "Constants/utils";
import AddChildDataModal from "Components/CategoryChildrenPage/Modals/AddChildDataModal";
import AddCategoryPage from "./Modals/AddCategoryPage";
import EditCategoryPage from "./Modals/EditDataModal";
import ViewCategoryForm from "./Modals/ViewCategoryPage/ViewCategoryForm";
import ViewCategoryPage from "./Modals/ViewCategoryPage";

const CategoryPage = () => {
  const [modalData, setModalData] = useState({
    type: null,
    data: null,
    modalContent: <></>,
    modalTitle: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  const [addShowErrorToast, setAddShowErrorToast] = useState(false);
  const [addShowErrorToastMessage, setAddShowErrorToastMessage] = useState("");
  const [addShowToastMessage, setAddShowToastMessage] = useState("");
  const [addShowToast, setAddShowToast] = useState(false);

  const [openAddProductPage, setOpenAddProductPage] = useState(false);
  const [openEditProductPage, setOpenEditProductPage] = useState(false);
  const [openViewCategoryPage, setOpenViewCategoryPage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryList = useSelector(
    (state) => state?.CategoryList?.categoryList?.categoryList
  );

  useEffect(() => {
    if (!categoryList || categoryList.length === 0) {
      dispatch(getCategory())
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, categoryList]);

  const tableHeaders = [
    { title: "S.No.", class: "" },
    { title: "Title", class: "" },
    { title: "Image", class: "" },
    { title: "Sub Categories", class: "" },
    { title: "Action", class: "text-center" },
  ];

  const tableActions = [
    {
      name: "View",
      class: "eye",
      icon: "fa-solid fa-eye",
      onClick: (data) => {
        setOpenViewCategoryPage(true);
        setModalData({ data: data });
      },
    },
    {
      name: "Edit",
      class: "edit",
      icon: "far fa-edit",
      onClick: (data) => {
        setOpenEditProductPage(true);
        setModalData({ type: "Edit", data: data });
      },
    },
    {
      name: "Delete",
      class: "delete",
      icon: "far fa-trash-alt",
      onClick: (data) => {
        setShowModal(true);
        setModalData({
          type: "Delete",
          data: data,
          modalContent: (
            <DeleteDataModal
              categoryId={data._id}
              productName={data?.name}
              setShowModal={setShowModal} // Make sure you pass setShowModal
              setAddShowErrorToast={(err) => {
                setAddShowErrorToast(err);
              }} // Pass setShowErrorToast
              setAddShowErrorToastMessage={(msg) => {
                setAddShowErrorToastMessage(msg);
              }}
              setAddShowToast={(show) => {
                setAddShowToast(show);
              }}
              setAddShowToastMessage={(showMessage) => {
                setAddShowToastMessage(showMessage);
              }}
            />
          ),
          modalTitle: "Delete Category",
        });
      },
    },
  ];

  const handleAdd = () => {
    setOpenAddProductPage(true);
    // setModalData({ type: "Add", data: null });
  };

  const DataTableHeader = () => {
    return (
      <thead>
        <tr>
          {tableHeaders &&
            tableHeaders?.map((header, index) => (
              <th className={header?.class} key={index}>
                {header?.title}
              </th>
            ))}
        </tr>
      </thead>
    );
  };

  const DataTableBody = () => {
    const linkStyles = {
      fontSize: "12px",
      marginRight: "1rem",
      cursor: "pointer",
      textDecoration: "none",
      fontWeight: "bold",
      transition: "text-decoration 0.2s ease-in-out",
    };
    // const handleChildAdd = (id) => {
    //   setShowModal(true);
    //   setModalData({
    //     type: "Add",
    //     data: null,
    //     modalContent: (
    //       <AddChildDataModal
    //         setShowModal={setShowModal}
    //         categoryId={id}
    //         setAddShowErrorToast={(err) => {
    //           setAddShowErrorToast(err);
    //         }} // Pass setShowErrorToast
    //         setAddShowErrorToastMessage={(msg) => {
    //           setAddShowErrorToastMessage(msg);
    //         }}
    //         setAddShowToast={(show) => {
    //           setAddShowToast(show);
    //         }}
    //         setAddShowToastMessage={(showMessage) => {
    //           setAddShowToastMessage(showMessage);
    //         }}
    //       />
    //     ),
    //     modalTitle: "Add Child Category",
    //   });
    // };
    return (
      <tbody>
        {categoryList && categoryList.length > 0 ? (
          categoryList?.map((category, index) => (
            <tr key={category?._id}>
              <td>{index + 1}</td>
              <td style={{ textTransform: "capitalize" }}>{category?.name}</td>
              <td>
                <img
                  src={category?.categoryImage}
                  alt=""
                  width={70}
                  height={70}
                  loading="lazy"
                />
              </td>
              {category?.children?.length > 0 ? (
                <td
                  style={{
                    ...linkStyles,
                    ":hover": {
                      textDecoration: "underline", // Apply underline on hover
                    },
                  }}
                  onClick={() => ViewParticularUserHandler(category?._id)}
                >
                  {`View SubCategories (${category?.children?.length})`}
                </td>
              ) : (
                <td
                  style={{
                    fontSize: "12px",
                    marginRight: "1rem",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontWeight: "bold",
                    transition: "text-decoration 0.2s ease-in-out",
                    color: "#c22701",
                  }}
                  //   onClick={() => handleChildAdd(category?._id)}
                >
                  {`Add Child Category`}
                </td>
              )}
              <td>
                <div
                  className="table_icons d-flex align-items-center justify-content-center"
                  key={index}
                >
                  {tableActions?.map((action, index) => (
                    <div
                      key={index}
                      className={action.class.toLowerCase()}
                      onClick={() => action.onClick(category)}
                    >
                      <a href="#">
                        <i className={action.icon}></i>
                      </a>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>
              <div className="d-flex justify-content-center pt-4">
                <p className="text-red">Category list is empty !!</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  const InitialRender = () => {
    return (
      <>
        <Col md={4}>
          <div className="user_heading">
            <h3>Main Category</h3>
            <p>Welcome to Category page</p>
          </div>
        </Col>
        <Col md={4} style={{ paddingTop: "1.875rem" }}>
          <div className="manage_searchbar">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1" className="">
                <i className="fa-solid fa-magnifying-glass"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search NFT's"
                className=""
                aria-label="Search NFT's"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
        </Col>
        <Col md={4}>
          <div className="add_filter_btn d-flex justify-content-end">
            <a href="#" className="bgbtnred" onClick={handleAdd}>
              Add New Category
            </a>
          </div>
        </Col>
      </>
    );
  };

  const RenderTable = () => {
    return (
      <Col md={12}>
        <div className="user_table">
          <div className="nftstable">
            <div className="tablearea">
              <Table responsive className="m-0">
                <DataTableHeader />
                <DataTableBody />
              </Table>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  const ViewParticularUserHandler = (id) => {
    navigate(`/category/category-child/${id}`);
  };

  return (
    <Wrapper>
      <div className="user_management_list">
        <Row>
          {isLoading && isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <Spinner animation="border" role="status">
                <span className="sr-only"></span>
              </Spinner>
            </div>
          ) : (
            <>
              <InitialRender />
              {openAddProductPage && openAddProductPage ? (
                <AddCategoryPage
                  setOpenAddProductPage={setOpenAddProductPage}
                  setIsLoading={setIsLoading}
                  setAddShowErrorToast={(err) => {
                    setAddShowErrorToast(err);
                  }}
                  setAddShowErrorToastMessage={(msg) => {
                    setAddShowErrorToastMessage(msg);
                  }}
                  setAddShowToast={(show) => {
                    setAddShowToast(show);
                  }}
                  setAddShowToastMessage={(showMessage) => {
                    setAddShowToastMessage(showMessage);
                  }}
                />
              ) : openEditProductPage && openEditProductPage ? (
                <EditCategoryPage
                  categoryById={modalData?.data}
                  setOpenEditProductPage={setOpenEditProductPage}
                  setIsLoading={setIsLoading}
                  setAddShowErrorToast={(err) => {
                    setAddShowErrorToast(err);
                  }}
                  setAddShowErrorToastMessage={(msg) => {
                    setAddShowErrorToastMessage(msg);
                  }}
                  setAddShowToast={(show) => {
                    setAddShowToast(show);
                  }}
                  setAddShowToastMessage={(showMessage) => {
                    setAddShowToastMessage(showMessage);
                  }}
                />
              ) : openViewCategoryPage && openViewCategoryPage ? (
                <ViewCategoryPage
                  categoryData={modalData?.data}
                  setOpenViewCategoryPage={setOpenViewCategoryPage}
                />
              ) : (
                <RenderTable />
              )}
            </>
          )}
        </Row>
      </div>
      {modalData.type && (
        <DynamicModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          modalTitle={modalData.modalTitle}
          modalContent={modalData.modalContent}
        />
      )}
      {addShowErrorToast && (
        <ErrorToaster
          showErrorToast={addShowErrorToast}
          setShowErrorToast={setAddShowErrorToast}
          showErrorToastMessage={addShowErrorToastMessage}
          customErrorMessage={"Something wend wrong! Please Try Again"}
        />
      )}
      {addShowToast && (
        <SuccessToaster
          showToast={addShowToast}
          setShowToast={setAddShowToast}
          showToastMessage={addShowToastMessage}
          customMessage={`Please recheck your entry once`}
        />
      )}
    </Wrapper>
  );
};

export default CategoryPage;
