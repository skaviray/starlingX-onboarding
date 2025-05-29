package stx

type AuthPayload struct {
	Auth Auth `json:"auth"`
}

type Auth struct {
	Identity Identity `json:"identity"`
	Scope    Scope    `json:"scope"`
}

type Identity struct {
	Methods  []string `json:"methods"`
	Password Password `json:"password"`
}

type Password struct {
	User User `json:"user"`
}

type User struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	Domain   Domain `json:"domain"`
}

type Scope struct {
	Project Project `json:"project"`
}

type Project struct {
	Name   string `json:"name"`
	Domain Domain `json:"domain"`
}

type Domain struct {
	Name string `json:"name"`
}

type ISystemsResponse struct {
	Isystems []ISystem `json:"isystems"`
}

type ISystem struct {
	UUID            string        `json:"uuid"`
	SoftwareVersion string        `json:"software_version"`
	Name            string        `json:"name"`
	Links           []SystemLinks `json:"links"`
	CreatedAt       string        `json:"created_at"`
	UpdatedAt       string        `json:"updated_at"`
	Contact         *string       `json:"contact"`
	Location        *string       `json:"location"`
	Latitude        *string       `json:"latitude"`
	Longitude       *string       `json:"longitude"`
	Description     string        `json:"description"`
	SystemType      string        `json:"system_type"`
	SystemMode      string        `json:"system_mode"`
	Timezone        string        `json:"timezone"`
	Capabilities    Capabilities  `json:"capabilities"`
}

type SystemLinks struct {
	Href string `json:"href"`
	Rel  string `json:"rel"`
}

type Capabilities struct {
	SdnEnabled     bool   `json:"sdn_enabled"`
	SharedServices string `json:"shared_services"`
	BMRegion       string `json:"bm_region"`
	CinderBackend  string `json:"cinder_backend"`
	HTTPSEnabled   bool   `json:"https_enabled"`
	RegionConfig   bool   `json:"region_config"`
}
