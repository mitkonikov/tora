#include "pch.h"
#include "ExtensionHostImpl.h"

#pragma comment (lib, "Platform.lib")

void GFExt_SetLogger(GF::Interfaces::IAppLogger* loggerIn, Core::IErrorCode** errorOut)
{
}
void GFExt_CreateExtensionHost(GF::Interfaces::Ext::IExtensionHost** hostOut, Core::IErrorCode** errorOut)
{
	Core::call_and_translate_exception_for_dll_boundary([&] {
		Core::throw_if_invalid(hostOut);
		*hostOut = new ExtensionHost::impl::ExtensionHostImpl();
	}, errorOut);
}
