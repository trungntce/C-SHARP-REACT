import { Dictionary } from "../../common/types";
import { setFormData, useApi, useEditRef } from "../../common/hooks";
import { useEffect, useRef, useState } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import { Breadcrumb, Button, Card, CardBody, CardFooter, Col, Form, Input, Label, Row } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import MenuEdiit from "./MenuEdit";
import { executeIdle } from "../../common/utility";

const MenuList = (props: any) => {
  const { t } = useTranslation();

  const initRow = useRef<Dictionary>({});
  const addMenuRef = useRef<any>();
  const deleteMenuRef = useRef<any>();
  const editRef = useRef<any>();
  
  const [menuList, setMenuList] = useState<Dictionary[]>([]);  
  const { refetch, post, put, del } = useApi("menu", () => []); 
  const [expanded, setExpanded] = useState<string[]>([]);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      setMenuList(result.data);
    }
  };

  useEffect(() => {
    searchHandler();

    addMenuRef.current.disabled = true;
    deleteMenuRef.current.disabled = true;
  }, []);

  useEffect(() => {
    setExpanded([...["ROOT"], ...(() => menuList.filter(x => x.childCount > 0).map(y => y.menuId))()])
  }, [menuList]);

  const findMenu = (menuId: string) => {
    const filtered = menuList.filter(x => x.menuId == menuId);
    if(filtered && filtered.length)
      return filtered[0];

    return null;
  }

  const findChildMenu = (parentId: string) => {
    return menuList.filter(x => x.parentId == parentId);
  }

  const addMenuHandler = () => {
    const menuId = initRow.current.menuId;
    const siblings = findChildMenu(initRow.current.menuId);
    const max = Math.max(...siblings.map(x => x.menuSort));

    cancelHandler();

    executeIdle(() => {      
      initRow.current = { parentId: menuId, menuSort: max > 0 ? max + 100 : 100 };
      editRef.current.setForm(initRow.current);
      editRef.current.setShowModal(true);
      
      addMenuRef.current.disabled = true;
      deleteMenuRef.current.disabled = true;
    });
  }

  const nodeSelectHandler = (event: React.SyntheticEvent, nodeIds: Array<string> | string) => {
    if(nodeIds === "ROOT"){
      deleteMenuRef.current.disabled = true;

      initRow.current = {};
      editRef.current.setForm(initRow.current);
      editRef.current.setShowModal(false);

      addMenuRef.current.disabled = false;
      return;
    }

    const menu = findMenu(nodeIds as string);
    if(menu == null){
      cancelHandler();
      return;
    }

    cancelHandler();

    executeIdle(() => {
      initRow.current = menu;
      editRef.current.setForm(initRow.current);
      editRef.current.setShowModal(true);
  
      if(menu.depth < 2){
        addMenuRef.current.disabled = false;
      }else{
        addMenuRef.current.disabled = true;
      }
  
      if(menu.childCount > 0)
        deleteMenuRef.current.disabled = true;
      else
        deleteMenuRef.current.disabled = false;
    });
  }

  const cancelHandler = () => {
    initRow.current = {};
    editRef.current.setForm(initRow.current);
    editRef.current.setShowModal(false);
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    
    if(initRow.menuId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        cancelHandler();
        alertBox("수정이 완료되었습니다.");
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler();
        cancelHandler();
        alertBox("작성이 완료되었습니다.");
      }else if(result.data == -1){
        alertBox(`동일한 항목이 존재합니다.<br />Menu Id: ${newRow.menuId}`);
      }
    }
  };

  const deleteHandler = async () => {
    if(!initRow.current.menuId){
      alertBox("삭제할 멘뉴를 선택해 주세요.");
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(initRow.current);
      if(result.data > 0){
        searchHandler();
        alertBox("@DELETE_COMPLETE");
      }else if(result.data == -1){
        alertBox("하위메뉴 먼저 삭제해 주세요.");
      }
    }, async () => {

    });    
  }

  function MinusSquare(props: SvgIconProps) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

  function PlusSquare(props: SvgIconProps) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }

  function CloseSquare(props: SvgIconProps) {
    return (
      <SvgIcon
        className="mui-treeview-close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }

const StyledTreeItem = styled((props: TreeItemProps) => (
  <>
    <TreeItem {...props} />
  </>
  ))(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .mui-treeview-close': {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }));

  return (
    <>
      <ListBase
        deleteHandler={deleteHandler}
        folder="System Management"
        title="Menu"
        postfix="Management"
        icon="bold"
        buttons={[]}
        >          
          <Row>
            <Col md={4}>
              <Row>
                <Col>
                  <div className="d-flex gap-2 mb-3 list-button-wrap">
                    <Button innerRef={addMenuRef} type="button" color="success" onClick={addMenuHandler}>
                      <i className="uil uil-plus me-2"></i> {t("@ADD")}
                    </Button>
                    <Button innerRef={deleteMenuRef} type="button" color="light" onClick={deleteHandler}>
                      <i className="uil uil-trash me-2"></i> {t("@DELETE")}
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TreeView
                    className="height100vh-tree"
                    expanded={expanded}
                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                    defaultEndIcon={<CloseSquare />}
                    onNodeSelect={nodeSelectHandler}                
                    sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                  >
                    <StyledTreeItem nodeId="ROOT" label="Menu">
                      {menuList.filter(x => !x.parentId).map((item, index) => {
                        return (<StyledTreeItem key={item.menuId} nodeId={item.menuId} label={t(item.menuName)}>
                          {menuList.filter(x => item.menuId === x.parentId).map((childItem, childIndex) => {
                            return (<StyledTreeItem key={childItem.menuId} nodeId={childItem.menuId} label={t(childItem.menuName)}>
                              {menuList.filter(x => childItem.menuId === x.parentId).map((childChildItem, childChildIndex) => {
                                return (<StyledTreeItem key={childChildItem.menuId} nodeId={childChildItem.menuId} label={t(childChildItem.menuName)} />)
                              })}
                            </StyledTreeItem>)
                          })}
                        </StyledTreeItem>)
                      })}
                    </StyledTreeItem>
                  </TreeView>
                </Col>
              </Row>              
            </Col>
            <Col md={8}>
              <MenuEdiit
                ref={editRef}
                onComplete={editCompleteHandler}
                onCancel={cancelHandler}
              />
            </Col>
          </Row>             
      </ListBase>
    </>
  );
};
export default MenuList;
