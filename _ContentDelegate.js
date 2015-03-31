var delegateGetSet = require('./utils/delegateGetSet');

// délègue tous les get/set des propriétés de layout à '_content'
// réutilisable pour tous les cas où l'on veut simplement déléguer à un composant principal, en surchargeant uniquement certaines méthodes
module.exports = {
	width: delegateGetSet('_content', 'width'),
	height: delegateGetSet('_content', 'height'),
	depth: delegateGetSet('_content', 'depth'),
	left: delegateGetSet('_content', 'left'),
	top: delegateGetSet('_content', 'top'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
	visible: delegateGetSet('_content', 'visible'),
};