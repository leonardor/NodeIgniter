(function() {
	var MY_Language = {};
	
	MY_Language = Object.create(CI_Language).__construct();
	
	MY_Language.parent = CI_Language;
	MY_Language.name = 'MY_Language';
	
	MY_Language.$myLanguage = '';
	MY_Language.$myDomain = '';
	MY_Language.$myPath = '';
	MY_Language.$myLocale = '';
    
    /**
     * The constructor initialize the library
     *
     * @return MY_Language
     */
	MY_Language.__construct = function() {
       	this.$myDomain = 'lang';
       
       	PHP.putenv("LANGUAGE=null");
     	PHP.putenv("LANG=null");
     	
     	console.log('MY_Language.__construct()');
       
        CI_Common.log_message('debug','Gettext Class initialized');
        
        return this;
    }

	MY_Language.load = function($langfile, $idiom, $return) {
  		$langfile = this.$language || '';
  		$idiom = $idiom || '';
  		$return = $return || false;
  		
  		console.log('MY_Language.load()');
  
  		CI['session'] = CI_Common.load_class('Session');
  		CI['session'].__construct();

  		CI_View = CI['view'] = CI_Common.load_class('View');
  		CI_View.__construct();

    	if(PHP.stripos(PHP.$_SERVER['HTTP_HOST'],'.ro') !== false || PHP.stripos(PHP.$_SERVER['HTTP_HOST'],'.mpi') !== false){
        	CI.session.set_userdata({'language': 'ro'});
        	this.$language = 'ro';
        	var $locale = 'ro_RO';
        	$idiom = 'romanian';
        } else if(PHP.stripos(PHP.$_SERVER['HTTP_HOST'],'.ro') === false && PHP.stripos(PHP.$_SERVER['HTTP_HOST'],'.mpi') === false){
        	CI.session.set_userdata({'language': 'en'});
        	this.$language = 'en';
        	var $locale = 'en_US';
        	$idiom = 'english';
        } else {
        	CI.session.set_userdata({'language': 'en'});
        	
        	if(CI.session.userdata('language') == 'en') var $subfix = '_US';
        	else if(CI.session.userdata('language') == 'ro') var $subfix = '_RO';
        	
        	this.$language = CI.session.userdata('language');
        	var $locale = CI.session.userdata('language') + $subfix;
        	this.$language = 'en';
        	$idiom = 'english';
        }

     	PHP.putenv("LANGUAGE=" + $locale);
     	PHP.putenv("LANG=" + $locale);
		
        this.$myLanguage = this.$language;
        this.$myLocale = $locale;
        
        CI.view.set('language', this.$myLanguage);
		CI.view.set('locale', this.$myLocale);
        
        this.$myPath = PHP.constant('BASEPATH') + 'language/locales';

        CI_Common.log_message('debug', 'Gettext Class the domain chosen is: ' +  this.$myDomain);
        
        this.parent.load('validation', $idiom, $return);
        return true;
    }

    /**
     * Plural forms and dynamic allocation, added by Tchinkatchuk <mail by forum>
     * http://codeigniter.com/forums/viewthread/46701/
     *
     */

    /**
     * The translator method
     *
     * @param string $original the original string to translate
     * @param array $aParams the plural parameters
     * @return the string translated
     */
   	MY_Language._trans = function ($original) {
   		$aParams = $aParams || false;
   		//$original = str_replace(array("Ä¹Åº", "Ä¹Å�", "Ä‚Â®", "Ã„ï¿½"), array("s", "t", "i", "a"), $original);
    	
    	if ( $aParams['plural'] && $aParams['count'] ) {
    		var $sTranslate = PHP.ngettext($original, $aParams['plural'], $aParams['count']);
    		$sTranslate = this._replaceDynamically($sTranslate, $aParams);
        } else {
            var $sTranslate = PHP.gettext($original);
            if (PHP.is_array($aParams) && PHP.count($aParams) ) var $sTranslate = this._replaceDynamically($sTranslate, $aParams);
        }
    
        return $sTranslate;
    }

    /**
     * Allow dynamic allocation in traduction
     *
     * @final
     * @access private
     * @param  string $sString
     * @return string
     */
   	MY_Language._replaceDynamically = function($sString) {
        var $aTrad = [];
        
        for ( $i=1, $iMax = PHP.func_num_args(); $i<$iMax; $i++) {
            var $arg = PHP.func_get_arg($i);
            if (PHP.is_array($arg)) {
                for(var $key in $arg) {
                    $aTrad['%' + $key] = $arg[$key];
                }
            } else {
                $aTrad['%' + $key] = $arg;
            }
        }
        return PHP.strtr($sString, $aTrad);
    }
	
	module.exports = MY_Language;
})();