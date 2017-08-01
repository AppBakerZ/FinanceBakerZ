// import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';
// import moment from 'moment';
//
// import { routeHelpers } from '../../../../helpers/routeHelpers.js'
// import { userCurrencyHelpers } from '../../../../helpers/currencyHelpers'
// import { Categories } from '../../../../api/categories/categories.js'
//
// import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
// import { Button, Snackbar } from 'react-toolbox';
//
// import { Meteor } from 'meteor/meteor';
//
// import theme from './theme';
//
// import fonts from '/imports/ui/fonts.js';
//
//
// const il8n = defineMessages({
//     ADD_CATEGORY: {
//         id: 'CATEGORIES.ADD_CATEGORY'
//     },
//     UPDATE_CATEGORIES: {
//         id: 'CATEGORIES.UPDATE_CATEGORY'
//     },
//     ADD_CATEGORIES: {
//         id: 'CATEGORIES.ADD_CATEGORIES'
//     },
//     CATEGORY_NAME: {
//         id: 'CATEGORIES.CATEGORY_NAME'
//     },
//     CATEGORY_ICON: {
//         id: 'CATEGORIES.CATEGORY_ICON'
//     },
//     DISPLAY_CATEGORY_ICON: {
//         id: 'CATEGORIES.DISPLAY_CATEGORY_ICON'
//     },
//     PARENT_CATEGORY: {
//         id: 'CATEGORIES.PARENT_CATEGORY'
//     },
//     DISPLAY_PARENT_CATEGORY: {
//         id: 'CATEGORIES.DISPLAY_PARENT_CATEGORY'
//     }
// });
//
// class CategoryDetail extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             name: '',
//             icon: '',
//             active: false,
//             loading: false,
//             parent: null,
//             iconSelected: 'en'
//         };
//
//         this.icons = fonts.map((font, index) => {
//             index++;
//             if(index % 5 === 0){
//                 font.removeRightBorder = true
//             }
//             let lastItems = fonts.length % 5 === 0 ? 5 : fonts.length % 5;
//             if(index > fonts.length - lastItems){
//                 font.removeBottomBorder = true
//             }
//             return font
//         });
//
//     }
//
//     componentDidMount (){
//         this.setState(this.props.category);
//     }
//
//     categoryItem(category){
//         const containerStyle = {
//             display: 'flex',
//             flexDirection: 'row'
//         };
//
//         const contentStyle = {
//             display: 'flex',
//             flexDirection: 'column',
//             flexGrow: 2,
//             paddingTop: '4px'
//         };
//
//         return (
//             <div style={containerStyle}>
//                 <div className={theme.selectParent}>
//                     <i className={category.icon}/>
//                     <strong>{category.label}</strong>
//                 </div>
//             </div>
//         );
//     }
//
//     categoryIcons(icon){
//         let parentClass = '';
//         if(icon.removeRightBorder){
//             parentClass = dropdownTheme['removeRightBorder']
//         }
//
//         if(icon.removeBottomBorder){
//             parentClass = dropdownTheme['removeBottomBorder']
//         }
//
//         return (
//             <div className={parentClass} title={icon.label.replace(/-/g, " ")}>
//                 <i className={icon.value}/>
//             </div>
//         );
//     }
//
//
//
//     categories(){
//         let cats = this.props.categories.map((category) => {
//             return {value: category.name, label: category.name, icon: category.icon};
//         });
//         cats.unshift({value: null, label: 'No Parent'});
//         return cats
//     }
//
//     editCategory(){
//         routeHelpers.changeRoute(`/app/categories/edit/${this.props.params.id}`);
//     }
//
//     removeCategory(){
//         const { id } = this.props.params;
//         Meteor.call('projects.remove', {
//             project: {
//                 _id: id
//             }
//         }, (err, response) => {
//             if(err){
//                 this.setState({
//                     active: true,
//                     barMessage: err.reason,
//                     barIcon: 'error_outline',
//                     barType: 'cancel'
//                 });
//             }else{
//                 routeHelpers.changeRoute('/app/projects', 1200);
//                 this.setState({
//                     active: true,
//                     barMessage: 'Project deleted successfully',
//                     barIcon: 'done',
//                     barType: 'accept'
//                 });
//             }
//         });
//     }
//
//     handleBarClick (event, instance) {
//         this.setState({ active: false });
//     }
//
//     handleBarTimeout (event, instance) {
//         this.setState({ active: false });
//     }
//     /*************** template render ***************/
//     render() {
//         const { formatMessage } = this.props.intl;
//         let { category } = this.props;
//         let {_id, createdAt, amount, status } = category;
//         let date = moment(createdAt).format('DD-MMM-YYYY');
//         return (
//             <div className={theme.viewExpense}>
//                 <div className="container">
//                     <div className={theme.titleBox}>
//                         <Snackbar
//                             action='Dismiss'
//                             active={this.state.active}
//                             icon={this.state.barIcon}
//                             label={this.state.barMessage}
//                             timeout={2000}
//                             onClick={this.handleBarClick.bind(this)}
//                             onTimeout={this.handleBarTimeout.bind(this)}
//                             type={this.state.barType}
//                         />
//                         <h3>{category.name}</h3>
//                         <div className={theme.rightButtons}>
//                             <Button onClick={this.editCategory.bind(this)}
//                                     className='header-buttons'
//                                     label="edit"
//                                     name='Income'
//                                     flat />
//                             <Button onClick={this.removeCategory.bind(this)}
//                                     className='header-buttons'
//                                     label="delete"
//                                     name='Expense'
//                                     flat />
//                         </div>
//                     </div>
//
//                     <div className={theme.bankContent}>
//                         <div className={theme.depositContent}>
//                             <h6>Category ID: <span>{_id}</span></h6>
//                             <h6>Date: <span>{date}</span></h6>
//                             <h5><FormattedMessage {...il8n.CATEGORY_NAME} />: <span>{category.name}</span></h5>
//                             <h5><FormattedMessage {...il8n.DISPLAY_CATEGORY_ICON} />: <span><i className={category.icon}/></span></h5>
//                             {category.parent ? <h5><FormattedMessage {...il8n.DISPLAY_PARENT_CATEGORY} />: <span>{category.parent}</span></h5>  : ''}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//         );
//     }
// }
//
// CategoryDetail.propTypes = {
//     intl: intlShape.isRequired
// };
//
// CategoryDetail = createContainer((props) => {
//     const { id } = props.params;
//     const projectHandle = Meteor.subscribe('categories.single', id);
//     const category = Categories.findOne({_id: id});
//     return {
//         category: category ? category : {},
//     };
// }, CategoryDetail);
//
// export default injectIntl(CategoryDetail);
//
//
//
// // class Form extends Component {
// //
// //     render() {
// //         const { formatMessage } = this.props.intl;
// //         return (
// //             <form onSubmit={this.onSubmit.bind(this)} className={theme.addCategory}>
// //
// //                 <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />
// //
// //                 <h3 className={theme.titleAccount}><FormattedMessage {...il8n.ADD_CATEGORIES} /></h3>
// //
// //                 <Snackbar
// //                     action='Dismiss'
// //                     active={this.state.active}
// //                     icon={this.state.barIcon}
// //                     label={this.state.barMessage}
// //                     timeout={2000}
// //                     onClick={this.handleBarClick.bind(this)}
// //                     onTimeout={this.handleBarTimeout.bind(this)}
// //                     type={this.state.barType}
// //                 />
// //
// //
// //                 <Dropdown theme={dropdownTheme}
// //                           source={this.icons}
// //                           name='icon'
// //                           onChange={this.onChange.bind(this)}
// //                           value={this.state.icon}
// //                           label={formatMessage(il8n.CATEGORY_ICON)}
// //                           template={this.categoryIcons}
// //                           required
// //                 />
// //
// //                 <Dropdown
// //                     auto
// //                     name='parent'
// //                     onChange={this.onChangeParentCategory.bind(this)}
// //                     source={this.categories()}
// //                     value={this.state.parent}
// //                     label={formatMessage(il8n.PARENT_CATEGORY)}
// //                     template={this.categoryItem}
// //                 />
// //             </form>
// //         );
// //     }
// // }